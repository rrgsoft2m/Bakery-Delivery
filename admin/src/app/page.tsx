'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminHome() {
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem('admin-token');
        router.replace(token ? '/dashboard' : '/login');
    }, [router]);
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-bakery-500 border-t-transparent rounded-full" />
        </div>
    );
}
