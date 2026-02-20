'use client';
import { useState, useEffect } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/api';
import { Plus, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const cats = ['cakes', 'pastries', 'bread', 'cookies', 'drinks', 'special'];
const catLabels: Record<string, string> = {
    cakes: 'Tortlar', pastries: 'Pecheniye', bread: 'Non',
    cookies: 'Pechene', drinks: 'Ichimliklar', special: 'Maxsus',
};
const empty = { name: { uz: '', ru: '', en: '' }, description: { uz: '', ru: '', en: '' }, price: 0, category: 'cakes', imageUrl: '', isAvailable: true };

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [form, setForm] = useState<any>({ ...empty });
    const [saving, setSaving] = useState(false);

    const load = () => { setLoading(true); getProducts().then(setProducts).catch(() => { }).finally(() => setLoading(false)); };
    useEffect(load, []);

    const openNew = () => { setEditing(null); setForm({ ...empty }); setModal(true); };
    const openEdit = (p: any) => { setEditing(p); setForm({ name: p.name, description: p.description, price: p.price, category: p.category, imageUrl: p.imageUrl, isAvailable: p.isAvailable }); setModal(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editing) { await updateProduct(editing._id, form); toast.success('Yangilandi!'); }
            else { await createProduct(form); toast.success('Yaratildi!'); }
            setModal(false); load();
        } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Bu mahsulotni o'chirishni xohlaysizmi?")) return;
        try { await deleteProduct(id); toast.success("O'chirildi!"); load(); } catch (e: any) { toast.error(e.message); }
    };

    const setName = (lang: string, val: string) => setForm({ ...form, name: { ...form.name, [lang]: val } });
    const setDesc = (lang: string, val: string) => setForm({ ...form, description: { ...form.description, [lang]: val } });
    const formatPrice = (p: number) => new Intl.NumberFormat('uz-UZ').format(p);
    const langLabels: Record<string, string> = { uz: "O'zbekcha", ru: 'Ruscha', en: 'Inglizcha' };

    return (
        <div>
            <Toaster position="top-right" />
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Mahsulotlar ({products.length})</h2>
                <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors">
                    <Plus size={16} />Mahsulot qo&apos;shish
                </button>
            </div>

            {loading ? <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(p => (
                        <div key={p._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <div className="h-40 bg-gray-100 relative">
                                {p.imageUrl && <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />}
                                <span className="absolute top-2 left-2 px-2 py-1 bg-white/80 rounded-lg text-xs font-medium">{catLabels[p.category] || p.category}</span>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold">{p.name.uz}</h3>
                                <p className="text-sm text-gray-500 mt-1">{p.name.ru} / {p.name.en}</p>
                                <p className="text-orange-600 font-bold mt-2">{formatPrice(p.price)} so&apos;m</p>
                                <div className="flex gap-2 mt-3">
                                    <button onClick={() => openEdit(p)} className="flex-1 flex items-center justify-center gap-1 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100"><Edit2 size={14} />Tahrirlash</button>
                                    <button onClick={() => handleDelete(p._id)} className="flex items-center justify-center gap-1 py-2 px-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium hover:bg-red-100"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {modal && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">{editing ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}</h3>
                            <button onClick={() => setModal(false)}><X size={20} /></button>
                        </div>
                        <div className="space-y-4">
                            {['uz', 'ru', 'en'].map(lang => (
                                <div key={lang}>
                                    <label className="text-xs font-medium text-gray-500">{langLabels[lang]} nomi</label>
                                    <input value={form.name[lang]} onChange={e => setName(lang, e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-xl text-sm" />
                                </div>
                            ))}
                            {['uz', 'ru', 'en'].map(lang => (
                                <div key={'d' + lang}>
                                    <label className="text-xs font-medium text-gray-500">{langLabels[lang]} tavsifi</label>
                                    <textarea value={form.description[lang]} onChange={e => setDesc(lang, e.target.value)} rows={2} className="w-full mt-1 px-3 py-2 border rounded-xl text-sm resize-none" />
                                </div>
                            ))}
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-medium text-gray-500">Narxi</label>
                                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-xl text-sm" /></div>
                                <div><label className="text-xs font-medium text-gray-500">Kategoriya</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-xl text-sm">
                                        {cats.map(c => <option key={c} value={c}>{catLabels[c]}</option>)}
                                    </select></div>
                            </div>
                            <div><label className="text-xs font-medium text-gray-500">Rasm URL</label>
                                <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-xl text-sm" /></div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} className="rounded" />
                                <span className="text-sm">Mavjud</span>
                            </label>
                            <button onClick={handleSave} disabled={saving} className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2">
                                {saving ? <Loader2 size={18} className="animate-spin" /> : editing ? 'Yangilash' : 'Yaratish'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
