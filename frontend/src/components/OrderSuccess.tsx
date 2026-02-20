'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft, PartyPopper } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface OrderSuccessProps {
    order: any;
    onBack: () => void;
}

export default function OrderSuccess({ order, onBack }: OrderSuccessProps) {
    const { t, locale } = useI18n();
    const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price);

    useEffect(() => {
        // Trigger confetti
        const launchConfetti = async () => {
            try {
                const confetti = (await import('canvas-confetti')).default;
                const end = Date.now() + 3000;
                const colors = ['#e0773d', '#d15f32', '#ae492b', '#f5d2b5', '#faeadb'];
                const frame = () => {
                    confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors });
                    confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors });
                    if (Date.now() < end) requestAnimationFrame(frame);
                };
                frame();
            } catch { }
        };
        launchConfetti();
    }, []);

    return (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] bg-[var(--bg-primary)] flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle size={48} className="text-green-500" />
                </motion.div>
                <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}
                    className="font-playfair text-3xl font-bold mb-3">{t('order_success')}</motion.h1>
                <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                    className="text-[var(--text-secondary)] mb-8">{t('order_success_desc')}</motion.p>
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                    className="glass-card p-6 mb-8 text-left">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between"><span className="text-[var(--text-secondary)]">{t('order_id')}</span>
                            <span className="font-mono font-bold">{order._id?.slice(-8) || 'N/A'}</span></div>
                        <div className="flex justify-between"><span className="text-[var(--text-secondary)]">{t('status')}</span>
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-600">{t(order.status || 'pending')}</span></div>
                        <div className="flex justify-between"><span className="text-[var(--text-secondary)]">{t('payment_method')}</span>
                            <span className="font-semibold">{order.paymentType === 'click' ? t('click_pay') : t('cash')}</span></div>
                        <div className="border-t border-[var(--border)] pt-3 flex justify-between">
                            <span className="font-semibold">{t('total_price')}</span>
                            <span className="text-xl font-bold text-bakery-500">{formatPrice(order.totalPrice)} {t('price_currency')}</span></div>
                    </div>
                </motion.div>
                <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onBack}
                    className="neu-btn inline-flex items-center gap-2 px-8 py-4">
                    <ArrowLeft size={18} />{t('back_to_menu')}
                </motion.button>
            </div>
        </motion.div>
    );
}
