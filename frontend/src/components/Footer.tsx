'use client';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
    const { t } = useI18n();
    return (
        <footer className="py-12 px-4 border-t border-[var(--border)] mt-16">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="text-3xl">🍰</span>
                            <span className="font-playfair text-xl font-bold gradient-text">{t('app_name')}</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                            {t('hero_subtitle')}
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">{t('menu')}</h4>
                        <div className="space-y-2">
                            <a href="/" className="block text-sm text-[var(--text-secondary)] hover:text-bakery-500 transition-colors">{t('home')}</a>
                            <a href="#products" className="block text-sm text-[var(--text-secondary)] hover:text-bakery-500 transition-colors">{t('products')}</a>
                            <a href="#about" className="block text-sm text-[var(--text-secondary)] hover:text-bakery-500 transition-colors">{t('about')}</a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">{t('contact')}</h4>
                        <div className="space-y-2 text-sm text-[var(--text-secondary)]">
                            <p>📞 +998 94 585 14 94</p>
                            <p>
                                💬{' '}
                                <a href="https://t.me/rrgfcoder" target="_blank" rel="noopener noreferrer" className="hover:text-bakery-500 transition-colors underline">
                                    @rrgfcoder
                                </a>
                            </p>
                            <p>📍 Guliston, Sirdaryo</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-[var(--border)] pt-6 text-center text-sm text-[var(--text-secondary)]">
                    © 2026{' '}
                    <a href="https://t.me/rrgfcoder" target="_blank" rel="noopener noreferrer" className="hover:text-bakery-500 transition-colors font-medium">
                        RRGSOFT
                    </a>
                    {' '}tomonidan ishlab chiqilgan. Barcha huquqlar himoyalangan.
                </div>
            </div>
        </footer>
    );
}
