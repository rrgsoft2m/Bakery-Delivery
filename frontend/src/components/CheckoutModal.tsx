'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, CreditCard, Banknote, ArrowLeft, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useCart } from '@/lib/cart';
import { API_URL } from '@/lib/api';
import { getTelegramUser, getTelegramWebApp } from '@/lib/telegram';
import toast from 'react-hot-toast';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (order: any) => void;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess }: CheckoutModalProps) {
    const { t, locale } = useI18n();
    const { items, totalPrice, clearCart } = useCart();
    const [loading, setLoading] = useState(false);
    const [paymentType, setPaymentType] = useState<'cash' | 'click'>('cash');
    const tgUser = getTelegramUser();
    const [form, setForm] = useState({
        firstName: tgUser?.first_name || '',
        lastName: tgUser?.last_name || '',
        phone: '',
        address: '',
    });
    const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        setLoading(true);
        try {
            const orderData = {
                items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.product.price })),
                totalPrice, paymentType,
                firstName: form.firstName, lastName: form.lastName, phone: form.phone, address: form.address,
            };
            if (paymentType === 'click') {
                window.open('https://my.click.uz/services/pay/FCD68D7114BA49C3929BB40C4A4E57AB', '_blank');
            }

            // Send order directly to backend
            const res = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
            });
            const order = await res.json();

            if (!res.ok) throw new Error(order.error || 'Order failed');

            clearCart();
            onSuccess(order);
            toast.success(t('order_success'), { icon: '🎉' });
            const webapp = getTelegramWebApp();
            if (webapp) webapp.sendData(JSON.stringify({ orderId: order._id, total: totalPrice }));
        } catch (err: any) {
            console.error('Order error:', err);
            toast.error(err.message || 'Xatolik yuz berdi');
        } finally { setLoading(false); }
    };

    if (!isOpen) return null;

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]" />
            <motion.div
                initial={{ opacity: 0, x: "-50%", y: "-40%", scale: 0.95 }}
                animate={{ opacity: 1, x: "-50%", y: "-50%", scale: 1 }}
                exit={{ opacity: 0, x: "-50%", y: "-40%", scale: 0.95 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="fixed left-1/2 top-1/2 w-[calc(100%-2rem)] max-w-lg max-h-[85vh] z-[90] bg-[var(--bg-primary)] rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="bg-[var(--bg-primary)] border-b border-[var(--border)] p-5 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"><ArrowLeft size={20} /></button>
                        <h2 className="font-playfair text-xl font-bold">{t('checkout')}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"><X size={20} /></button>
                </div>

                {/* Scrollable form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-6 overflow-y-auto flex-1">
                    <div>
                        <h3 className="font-semibold mb-4 flex items-center gap-2"><MapPin size={18} className="text-bakery-500" />{t('delivery_info')}</h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs text-[var(--text-secondary)] font-medium mb-1 block">{t('first_name')}</label>
                                    <input type="text" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm focus:border-bakery-500 outline-none transition-colors" /></div>
                                <div><label className="text-xs text-[var(--text-secondary)] font-medium mb-1 block">{t('last_name')}</label>
                                    <input type="text" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm focus:border-bakery-500 outline-none transition-colors" /></div>
                            </div>
                            <div><label className="text-xs text-[var(--text-secondary)] font-medium mb-1 block">{t('phone')}</label>
                                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required placeholder="+998 94 585 14 94" className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm focus:border-bakery-500 outline-none transition-colors" /></div>
                            <div><label className="text-xs text-[var(--text-secondary)] font-medium mb-1 block">{t('address')}</label>
                                <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required rows={2} placeholder="Guliston, Sirdaryo" className="w-full px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-primary)] text-sm resize-none focus:border-bakery-500 outline-none transition-colors" /></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 flex items-center gap-2"><CreditCard size={18} className="text-bakery-500" />{t('payment_method')}</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => setPaymentType('cash')}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentType === 'cash' ? 'border-bakery-500 bg-bakery-50 dark:bg-bakery-900/20' : 'border-[var(--border)]'}`}>
                                <Banknote size={28} className={paymentType === 'cash' ? 'text-bakery-500' : 'text-[var(--text-secondary)]'} />
                                <span className={`text-sm font-semibold ${paymentType === 'cash' ? 'text-bakery-500' : ''}`}>{t('cash')}</span>
                            </motion.button>
                            <motion.button type="button" whileTap={{ scale: 0.98 }} onClick={() => setPaymentType('click')}
                                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentType === 'click' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-[var(--border)]'}`}>
                                <CreditCard size={28} className={paymentType === 'click' ? 'text-blue-500' : 'text-[var(--text-secondary)]'} />
                                <span className={`text-sm font-semibold ${paymentType === 'click' ? 'text-blue-500' : ''}`}>{t('click_pay')}</span>
                            </motion.button>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                        {items.map(item => (
                            <div key={item.productId} className="flex justify-between text-sm py-1">
                                <span className="text-[var(--text-secondary)]">{item.product.name[locale]} × {item.quantity}</span>
                                <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                            </div>
                        ))}
                        <div className="border-t border-[var(--border)] pt-3 mt-2 flex justify-between items-center">
                            <span className="font-semibold">{t('cart_total')}</span>
                            <span className="text-xl font-bold text-bakery-500">{formatPrice(totalPrice)} {t('price_currency')}</span>
                        </div>
                    </div>
                    <motion.button type="submit" disabled={loading || items.length === 0} whileTap={{ scale: 0.98 }}
                        className="w-full neu-btn py-4 text-center flex items-center justify-center gap-3 disabled:opacity-50">
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <>🛒 {t('place_order')}</>}
                    </motion.button>
                </form>
            </motion.div>
        </>
    );
}
