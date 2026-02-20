'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useCart } from '@/lib/cart';

interface CartDrawerProps {
    onCheckout: () => void;
}

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
    const { t, locale } = useI18n();
    const { items, removeFromCart, updateQuantity, clearCart, totalPrice, isCartOpen, setCartOpen } = useCart();

    const formatPrice = (price: number) => new Intl.NumberFormat('uz-UZ').format(price);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartOpen(false)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[70]
              bg-[var(--bg-primary)] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-bakery-500" size={24} />
                                <h2 className="font-playfair text-xl font-bold">{t('cart')}</h2>
                                <span className="px-2 py-0.5 bg-bakery-100 dark:bg-bakery-900/30 text-bakery-600 text-xs font-bold rounded-full">
                                    {items.length}
                                </span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setCartOpen(false)}
                                className="p-2 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                            >
                                <X size={20} />
                            </motion.button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {items.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-20"
                                >
                                    <span className="text-6xl block mb-4">🛒</span>
                                    <p className="text-[var(--text-secondary)] text-lg mb-2">{t('cart_empty')}</p>
                                    <button
                                        onClick={() => setCartOpen(false)}
                                        className="text-bakery-500 font-semibold hover:underline"
                                    >
                                        {t('continue_shopping')}
                                    </button>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {items.map((item, i) => (
                                            <motion.div
                                                key={item.productId}
                                                layout
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -50, height: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex gap-4 p-3 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]"
                                            >
                                                {/* Product image */}
                                                <div className="w-20 h-20 rounded-xl overflow-hidden bg-bakery-100 dark:bg-chocolate-800 flex-shrink-0 relative">
                                                    {item.product.imageUrl ? (
                                                        <Image
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name[locale]}
                                                            fill
                                                            className="object-cover"
                                                            sizes="80px"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">🍰</div>
                                                    )}
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-sm truncate">{item.product.name[locale]}</h4>
                                                    <p className="text-bakery-500 font-bold text-sm mt-1">
                                                        {formatPrice(item.product.price)} {t('price_currency')}
                                                    </p>

                                                    {/* Quantity controls */}
                                                    <div className="flex items-center gap-3 mt-2">
                                                        <div className="flex items-center gap-1 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)]">
                                                            <button
                                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-l-xl hover:bg-bakery-100 dark:hover:bg-bakery-900/20 transition-colors"
                                                            >
                                                                <Minus size={14} />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                                className="w-8 h-8 flex items-center justify-center rounded-r-xl hover:bg-bakery-100 dark:hover:bg-bakery-900/20 transition-colors"
                                                            >
                                                                <Plus size={14} />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeFromCart(item.productId)}
                                                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Line total */}
                                                <div className="text-right">
                                                    <p className="font-bold text-sm">
                                                        {formatPrice(item.product.price * item.quantity)}
                                                    </p>
                                                    <p className="text-xs text-[var(--text-secondary)]">{t('price_currency')}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-5 border-t border-[var(--border)] space-y-4">
                                {/* Total */}
                                <div className="flex items-center justify-between">
                                    <span className="text-[var(--text-secondary)] font-medium">{t('cart_total')}:</span>
                                    <span className="text-2xl font-bold text-bakery-500">
                                        {formatPrice(totalPrice)} <span className="text-sm">{t('price_currency')}</span>
                                    </span>
                                </div>

                                {/* Checkout button */}
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onCheckout}
                                    className="w-full neu-btn text-center flex items-center justify-center gap-3 py-4"
                                >
                                    {t('checkout')}
                                    <ArrowRight size={18} />
                                </motion.button>

                                {/* Clear */}
                                <button
                                    onClick={clearCart}
                                    className="w-full text-center text-sm text-red-400 hover:text-red-500 transition-colors py-2"
                                >
                                    {locale === 'uz' ? 'Savatni tozalash' : locale === 'ru' ? 'Очистить корзину' : 'Clear cart'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
