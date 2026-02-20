'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingBag, Users, LogOut, Menu, X } from 'lucide-react';

const navItems = [
    { href: '/dashboard', label: 'Boshqaruv', icon: LayoutDashboard },
    { href: '/dashboard/products', label: 'Mahsulotlar', icon: Package },
    { href: '/dashboard/orders', label: 'Buyurtmalar', icon: ShoppingBag },
    { href: '/dashboard/users', label: 'Foydalanuvchilar', icon: Users },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('admin-token')) router.replace('/login');
    }, [router]);

    const logout = () => { localStorage.removeItem('admin-token'); router.replace('/login'); };

    return (
        <div className="min-h-screen flex" suppressHydrationWarning={true}>
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:flex lg:flex-col`}>
                <div className="p-6 flex items-center gap-3">
                    <span className="text-2xl">🍰</span>
                    <span className="font-bold text-lg">Boshqaruv Paneli</span>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden ml-auto"><X size={20} /></button>
                </div>
                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${pathname === item.href ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <item.icon size={18} />{item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-all">
                        <LogOut size={18} />Chiqish
                    </button>
                </div>
            </aside>

            {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-40 lg:hidden" />}

            <main className="flex-1 min-h-screen">
                <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-4">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu size={20} /></button>
                    <h1 className="text-lg font-semibold">{navItems.find(n => n.href === pathname)?.label || 'Boshqaruv'}</h1>
                </header>
                <div className="p-6">{children}</div>
            </main>
        </div>
    );
}
