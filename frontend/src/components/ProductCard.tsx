'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShoppingCart, Plus, Star } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useCart } from '@/lib/cart';
import toast from 'react-hot-toast';

interface ProductCardProps {
    product: any;
    index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
    const { t, locale } = useI18n();
    const { addToCart } = useCart();
    const cardRef = useRef<HTMLDivElement>(null);
    const [tiltStyle, setTiltStyle] = useState({});

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        setTiltStyle({
            transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
        });
    };

    const handleMouseLeave = () => {
        setTiltStyle({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' });
    };

    const handleAdd = () => {
        addToCart(product);
        toast.success(`${product.name[locale]} ${locale === 'uz' ? 'savatga qo\'shildi' : locale === 'ru' ? 'добавлен в корзину' : 'added to cart'}`, {
            icon: '🛒',
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ').format(price);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
        >
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    ...tiltStyle,
                    transition: 'transform 0.15s ease-out',
                }}
                className="card-3d"
            >
                <div className="glass-card overflow-hidden group cursor-pointer">
                    {/* Image */}
                    <div className="relative h-48 sm:h-56 overflow-hidden bg-gradient-to-br from-bakery-100 to-cream-200 dark:from-chocolate-800 dark:to-chocolate-900">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.name[locale]}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-6xl">
                                🍰
                            </div>
                        )}

                        {/* Category badge */}
                        <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold
                bg-white/80 dark:bg-black/50 backdrop-blur-sm
                text-bakery-700 dark:text-bakery-300">
                                {t(product.category as any)}
                            </span>
                        </div>

                        {/* Quick add button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleAdd}
                            className="absolute top-3 right-3 w-10 h-10 rounded-full
                bg-bakery-500 text-white flex items-center justify-center
                shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            <Plus size={20} />
                        </motion.button>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Content */}
                    <div className="p-5">
                        {/* Rating stars (decorative) */}
                        <div className="flex items-center gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                            ))}
                            <span className="text-xs text-[var(--text-secondary)] ml-1">(4.{product.price % 10})</span>
                        </div>

                        {/* Name */}
                        <h3 className="font-playfair text-lg font-bold mb-1 line-clamp-1
              text-[var(--text-primary)]">
                            {product.name[locale]}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2 leading-relaxed">
                            {product.description[locale]}
                        </p>

                        {/* Price + Add */}
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-2xl font-bold text-bakery-500">
                                    {formatPrice(product.price)}
                                </span>
                                <span className="text-xs text-[var(--text-secondary)] ml-1">
                                    {t('price_currency')}
                                </span>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleAdd}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                  bg-bakery-500 hover:bg-bakery-600 text-white text-sm font-semibold
                  transition-colors shadow-md shadow-bakery-500/25"
                            >
                                <ShoppingCart size={16} />
                                <span className="hidden sm:inline">{t('add_to_cart')}</span>
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
