'use client';
import { useState, useEffect } from 'react';
import { getUsers } from '@/lib/api';
import { Search } from 'lucide-react';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setLoading(true);
        getUsers(search ? `search=${search}` : '')
            .then(d => setUsers(d.users || []))
            .catch(() => setUsers([]))
            .finally(() => setLoading(false));
    }, [search]);

    return (
        <div>
            <div className="relative max-w-sm mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Foydalanuvchi qidirish..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-orange-400" />
            </div>

            {loading ? <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" /></div> : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Ism</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Telefon</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Telegram ID</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Til</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-500">Qo&apos;shilgan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 && <tr><td colSpan={5} className="text-center py-8 text-gray-400">Foydalanuvchilar topilmadi</td></tr>}
                            {users.map(u => (
                                <tr key={u._id} className="border-t border-gray-50 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td>
                                    <td className="px-4 py-3 text-gray-500">{u.phone || '—'}</td>
                                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{u.telegramId || '—'}</td>
                                    <td className="px-4 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium uppercase">{u.language}</span></td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString('uz-UZ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
