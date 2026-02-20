const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function adminFetch(endpoint: string, options?: RequestInit) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin-token') : '';
    const res = await fetch(`${API}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options?.headers },
        ...options,
    });
    if (res.status === 401) {
        if (typeof window !== 'undefined') { localStorage.removeItem('admin-token'); window.location.href = '/login'; }
        throw new Error('Unauthorized');
    }
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.error || 'Error'); }
    return res.json();
}

export const adminLogin = (email: string, password: string) =>
    fetch(`${API}/api/auth/admin/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    }).then(r => r.json());

export const getDashboardStats = () => adminFetch('/api/dashboard/stats');
export const getProducts = () => adminFetch('/api/products');
export const createProduct = (data: any) => adminFetch('/api/products', { method: 'POST', body: JSON.stringify(data) });
export const updateProduct = (id: string, data: any) => adminFetch(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProduct = (id: string) => adminFetch(`/api/products/${id}`, { method: 'DELETE' });
export const getOrders = (params?: string) => adminFetch(`/api/orders${params ? '?' + params : ''}`);
export const updateOrderStatus = (id: string, status: string) => adminFetch(`/api/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
export const getUsers = (params?: string) => adminFetch(`/api/users${params ? '?' + params : ''}`);
