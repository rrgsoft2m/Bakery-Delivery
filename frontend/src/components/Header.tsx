'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import {
    ShoppingCart, Sun, Moon, Globe, Menu, X, Search,
    ChevronDown, User
} from 'lucide-react';
import { useI18n, Locale } from '@/lib/i18n';
import { useCart } from '@/lib/cart';

const langLabels: Record<Locale, string> = { uz: '🇺🇿 UZ', ru: '🇷🇺 RU', en: '🇬🇧 EN' };

export default function Header() {
    const { t, locale, setLocale, locales } = useI18n();
    const { totalItems, setCartOpen } = useCart();
    const { theme, setTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [langDropdown, setLangDropdown] = useState(false);
    const [mounted, setMounted] = useState(false);
    const langRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (langRef.current && !langRef.current.contains(e.target as Node)) {
                setLangDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="fixed top-0 left-0 right-0 z-50 glass"
            style={{ borderRadius: 0, borderBottom: '1px solid var(--glass-border)' }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20">
                    {/* Logo */}
                    <motion.a
                        href="/"
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.02 }}
                    >
                        <span className="text-3xl sm:text-4xl">🍰</span>
                        <span className="font-playfair text-xl sm:text-2xl font-bold gradient-text hidden sm:block">
                            {t('app_name')}
                        </span>
                    </motion.a>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        <a href="/" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors font-medium">
                            {t('home')}
                        </a>
                        <a href="#products" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors font-medium">
                            {t('products')}
                        </a>
                        <a href="#about" className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors font-medium">
                            {t('about')}
                        </a>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Language Switcher */}
                        <div ref={langRef} className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setLangDropdown(!langDropdown)}
                                className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium
                  bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
                            >
                                <Globe size={16} />
                                <span className="hidden sm:inline">{langLabels[locale]}</span>
                                <ChevronDown size={14} className={`transition-transform ${langDropdown ? 'rotate-180' : ''}`} />
                            </motion.button>
                            <AnimatePresence>
                                {langDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 glass p-2 min-w-[120px]"
                                        style={{ borderRadius: '16px' }}
                                    >
                                        {locales.map((l) => (
                                            <button
                                                key={l}
                                                onClick={() => { setLocale(l); setLangDropdown(false); }}
                                                className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition-all
                          ${locale === l ? 'bg-bakery-500 text-white' : 'hover:bg-[var(--bg-secondary)] text-[var(--text-secondary)]'}`}
                                            >
                                                {langLabels[l]}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Theme Toggle */}
                        {mounted && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="p-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </motion.button>
                        )}

                        {/* Cart Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCartOpen(true)}
                            className="relative p-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] transition-all"
                        >
                            <ShoppingCart size={20} />
                            <AnimatePresence>
                                {totalItems > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 bg-bakery-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold"
                                    >
                                        {totalItems}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        {/* Mobile Menu */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-secondary)]"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden border-t border-[var(--border)]"
                    >
                        <div className="p-4 flex flex-col gap-3">
                            <a href="/" className="px-4 py-3 rounded-xl hover:bg-[var(--bg-secondary)] font-medium transition-all">
                                {t('home')}
                            </a>
                            <a href="#products" className="px-4 py-3 rounded-xl hover:bg-[var(--bg-secondary)] font-medium transition-all">
                                {t('products')}
                            </a>
                            <a href="#about" className="px-4 py-3 rounded-xl hover:bg-[var(--bg-secondary)] font-medium transition-all">
                                {t('about')}
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
