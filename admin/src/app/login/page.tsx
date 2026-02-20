'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { adminLogin } from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setError('');
        try {
            const data = await adminLogin(email, password);
            if (data.token) {
                localStorage.setItem('admin-token', data.token);
                router.push('/dashboard');
            } else {
                setError(data.error || 'Kirish xatosi');
            }
        } catch { setError('Ulanish xatosi'); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #fdf6f0 0%, #faeadb 100%)' }} suppressHydrationWarning>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-5xl block mb-4">🍰</span>
                    <h1 className="text-3xl font-bold text-gray-900">Boshqaruv Paneli</h1>
                    <p className="text-gray-500 mt-2">Shirinliklaringizni boshqarish uchun kiring</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 space-y-5">
                    {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center">{error}</div>}
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Elektron pochta</label>
                        <div className="relative">
                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@bakery.uz"
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Parol</label>
                        <div className="relative">
                            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••"
                                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all" />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-400 to-orange-600 text-white font-semibold shadow-lg shadow-orange-200 hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {loading ? <Loader2 size={20} className="animate-spin" /> : 'Kirish'}
                    </button>
                    <p className="text-xs text-gray-400 text-center">Standart: admin@bakery.uz / admin123</p>
                </form>
            </div>
        </div>
    );
}
