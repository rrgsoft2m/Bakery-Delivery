'use client';
import { useState, useEffect } from 'react';
import { getDashboardStats } from '@/lib/api';
import { Users, ShoppingBag, Package, DollarSign, TrendingUp } from 'lucide-react';

const statusLabels: Record<string, string> = {
    pending: 'Kutilmoqda', paid: "To'langan", preparing: 'Tayyorlanmoqda',
    delivering: 'Yetkazilmoqda', delivered: 'Yetkazildi', cancelled: 'Bekor qilingan',
};

export default function DashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats().then(setStats).catch(() => {
            setStats({
                totalUsers: 0, totalOrders: 0, totalProducts: 0, totalRevenue: 0,
                ordersByStatus: [], paymentBreakdown: [],
            });
        }).finally(() => setLoading(false));
    }, []);

    const formatPrice = (p: number) => new Intl.NumberFormat('uz-UZ').format(p);

    if (loading) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div>;

    const cards = [
        { title: 'Jami foydalanuvchilar', value: stats?.totalUsers || 0, icon: Users, color: 'bg-blue-50 text-blue-600', iconBg: 'bg-blue-100' },
        { title: 'Jami buyurtmalar', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'bg-green-50 text-green-600', iconBg: 'bg-green-100' },
        { title: 'Mahsulotlar', value: stats?.totalProducts || 0, icon: Package, color: 'bg-purple-50 text-purple-600', iconBg: 'bg-purple-100' },
        { title: 'Daromad', value: formatPrice(stats?.totalRevenue || 0) + " so'm", icon: DollarSign, color: 'bg-orange-50 text-orange-600', iconBg: 'bg-orange-100' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {cards.map((card, i) => (
                    <div key={i} className={`${card.color} rounded-2xl p-6 border border-gray-100`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${card.iconBg} p-3 rounded-xl`}><card.icon size={20} /></div>
                            <TrendingUp size={16} className="opacity-50" />
                        </div>
                        <p className="text-2xl font-bold">{card.value}</p>
                        <p className="text-sm opacity-70 mt-1">{card.title}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-semibold mb-4">Buyurtmalar holati bo&apos;yicha</h3>
                    <div className="space-y-3">
                        {(stats?.ordersByStatus || []).length === 0 && <p className="text-gray-400 text-sm">Hali buyurtmalar yo&apos;q</p>}
                        {(stats?.ordersByStatus || []).map((s: any) => (
                            <div key={s._id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${s._id === 'delivered' ? 'bg-green-500' : s._id === 'paid' ? 'bg-blue-500' : s._id === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                    <span className="text-sm">{statusLabels[s._id] || s._id}</span>
                                </div>
                                <span className="font-semibold">{s.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="font-semibold mb-4">To&apos;lov turlari</h3>
                    <div className="space-y-3">
                        {(stats?.paymentBreakdown || []).length === 0 && <p className="text-gray-400 text-sm">Hali to&apos;lovlar yo&apos;q</p>}
                        {(stats?.paymentBreakdown || []).map((p: any) => (
                            <div key={p._id} className="flex items-center justify-between">
                                <span className="text-sm">{p._id === 'cash' ? 'Naqd pul' : p._id === 'click' ? 'Click' : p._id}</span>
                                <div className="text-right">
                                    <span className="font-semibold">{p.count} buyurtma</span>
                                    <span className="text-xs text-gray-400 ml-2">({formatPrice(p.total)} so&apos;m)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
