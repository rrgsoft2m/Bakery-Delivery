const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchAPI(endpoint: string, options?: RequestInit) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        ...options,
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Network error' }));
        throw new Error(err.error || 'Request failed');
    }
    return res.json();
}

// Products
export const getProducts = (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchAPI(`/api/products${query}`);
};

export const getProduct = (id: string) => fetchAPI(`/api/products/${id}`);

// Cart
export const getCart = (userId: string) => fetchAPI(`/api/cart/${userId}`);
export const addToCartAPI = (data: any) =>
    fetchAPI('/api/cart/add', { method: 'POST', body: JSON.stringify(data) });
export const removeFromCartAPI = (data: any) =>
    fetchAPI('/api/cart/remove', { method: 'POST', body: JSON.stringify(data) });

// Orders
export const createOrder = (data: any) =>
    fetchAPI('/api/orders', { method: 'POST', body: JSON.stringify(data) });
export const getUserOrders = (userId: string) =>
    fetchAPI(`/api/orders/user/${userId}`);
export const getOrder = (id: string) =>
    fetchAPI(`/api/orders/${id}`);

// Auth
export const verifyTelegram = (data: any) =>
    fetchAPI('/api/auth/telegram/verify', { method: 'POST', body: JSON.stringify(data) });

// Payments
export const clickCallback = (orderId: string) =>
    fetchAPI('/api/payments/click/callback', { method: 'POST', body: JSON.stringify({ orderId }) });

export { API_URL };
