'use client';
import { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

const statuses = ['pending', 'paid', 'preparing', 'delivering', 'delivered', 'cancelled'];
const statusLabels: Record<string, string> = {
    pending: 'Kutilmoqda', paid: "To'langan", preparing: 'Tayyorlanmoqda',
    delivering: 'Yetkazilmoqda', delivered: 'Yetkazildi', cancelled: 'Bekor qilingan',
};
const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700', paid: 'bg-blue-100 text-blue-700',
    preparing: 'bg-purple-100 text-purple-700', delivering: 'bg-cyan-100 text-cyan-700',
    delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    const load = () => {
        setLoading(true);
        getOrders(filter ? `status=${filter}` : '')
            .then(d => setOrders(d.orders || []))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    };
    useEffect(load, [filter]);

    const handleStatus = async (id: string, status: string) => {
        try { await updateOrderStatus(id, status); toast.success('Yangilandi!'); load(); }
        catch (e: any) { toast.error(e.message); }
    };

    const formatPrice = (p: number) => new Intl.NumberFormat('uz-UZ').format(p);

    return (
        <div>
            <Toaster position="top-right" />
            <div className="flex flex-wrap gap-2 mb-6">
                <button onClick={() => setFilter('')} className={`px-4 py-2 rounded-xl text-sm font-medium ${!filter ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>Barchasi</button>
                {statuses.map(s => (
                    <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === s ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>{statusLabels[s]}</button>
                ))}
            </div>

            {loading ? <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div> : (
                <div className="space-y-4">
                    {orders.length === 0 && <p className="text-center text-gray-400 py-8">Buyurtmalar topilmadi</p>}
                    {orders.map(order => (
                        <div key={order._id} className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                                <div>
                                    <p className="font-mono text-sm text-gray-400">#{order._id?.slice(-8)}</p>
                                    <p className="font-semibold">{order.firstName} {order.lastName}</p>
                                    <p className="text-sm text-gray-500">{order.phone} · {order.address}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-100'}`}>{statusLabels[order.status] || order.status}</span>
                                    <p className="text-orange-600 font-bold mt-1">{formatPrice(order.totalPrice)} so&apos;m</p>
                                    <p className="text-xs text-gray-400">{order.paymentType === 'cash' ? 'Naqd pul' : order.paymentType}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {statuses.filter(s => s !== order.status).map(s => (
                                    <button key={s} onClick={() => handleStatus(order._id, s)}
                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 hover:bg-gray-100 transition-colors">
                                        → {statusLabels[s]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
