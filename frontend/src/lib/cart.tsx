'use client';
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export interface CartItem {
    productId: string;
    product: any;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, qty: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isCartOpen: boolean;
    setCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addToCart: () => { },
    removeFromCart: () => { },
    updateQuantity: () => { },
    clearCart: () => { },
    totalItems: 0,
    totalPrice: 0,
    isCartOpen: false,
    setCartOpen: () => { },
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('bakery-cart');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch { }
        }
    }, []);

    // Save to localStorage when items change
    useEffect(() => {
        localStorage.setItem('bakery-cart', JSON.stringify(items));
    }, [items]);

    const addToCart = useCallback((product: any) => {
        setItems(prev => {
            const existing = prev.find(i => i.productId === product._id);
            if (existing) {
                return prev.map(i =>
                    i.productId === product._id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { productId: product._id, product, quantity: 1 }];
        });
        setCartOpen(true);
    }, []);

    const removeFromCart = useCallback((productId: string) => {
        setItems(prev => prev.filter(i => i.productId !== productId));
    }, []);

    const updateQuantity = useCallback((productId: string, qty: number) => {
        if (qty <= 0) {
            setItems(prev => prev.filter(i => i.productId !== productId));
            return;
        }
        setItems(prev =>
            prev.map(i => (i.productId === productId ? { ...i, quantity: qty } : i))
        );
    }, []);

    const clearCart = useCallback(() => {
        setItems([]);
        setCartOpen(false);
    }, []);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            items, addToCart, removeFromCart, updateQuantity, clearCart,
            totalItems, totalPrice, isCartOpen, setCartOpen,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
