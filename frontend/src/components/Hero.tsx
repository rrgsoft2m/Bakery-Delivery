'use client';
import { motion } from 'framer-motion';
import { useI18n } from '@/lib/i18n';

export default function Hero() {
    const { t } = useI18n();

    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
            {/* Floating decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
                {['🍰', '🥐', '🧁', '🍞', '🍪', '☕', '🎂', '🍩'].map((emoji, i) => (
                    <motion.span
                        key={i}
                        className="absolute text-4xl md:text-6xl opacity-20"
                        initial={{ y: 0 }}
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 10, -10, 0],
                        }}
                        transition={{
                            duration: 4 + i * 0.5,
                            repeat: Infinity,
                            delay: i * 0.3,
                        }}
                        style={{
                            left: `${10 + i * 11}%`,
                            top: `${20 + (i % 3) * 25}%`,
                        }}
                    >
                        {emoji}
                    </motion.span>
                ))}
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-8
            bg-bakery-100/80 dark:bg-bakery-900/30 text-bakery-600 dark:text-bakery-300
            text-sm font-medium backdrop-blur-sm border border-bakery-200/50 dark:border-bakery-700/30"
                >
                    <span className="animate-bounce">✨</span>
                    {t('fresh_daily')}
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, type: 'spring', stiffness: 50 }}
                    className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
                >
                    <span className="gradient-text">{t('hero_title')}</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    {t('hero_subtitle')}
                </motion.p>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <motion.a
                        href="#products"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="neu-btn text-lg px-10 py-4 inline-flex items-center gap-3"
                    >
                        🛒 {t('hero_cta')}
                    </motion.a>
                    <motion.a
                        href="#about"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-10 py-4 rounded-2xl text-lg font-semibold
              border-2 border-bakery-300 dark:border-bakery-700
              text-bakery-600 dark:text-bakery-300
              hover:bg-bakery-50 dark:hover:bg-bakery-900/20 transition-all"
                    >
                        {t('about')} →
                    </motion.a>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
                >
                    {[
                        { icon: '🚚', title: t('free_delivery'), desc: t('free_delivery_desc') },
                        { icon: '🔥', title: t('fresh_baked'), desc: t('fresh_baked_desc') },
                        { icon: '⚡', title: t('fast_delivery'), desc: t('fast_delivery_desc') },
                    ].map((feat, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="glass-card p-6 text-center"
                        >
                            <span className="text-3xl mb-3 block">{feat.icon}</span>
                            <h3 className="font-bold text-sm mb-1">{feat.title}</h3>
                            <p className="text-xs text-[var(--text-secondary)]">{feat.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
        </section>
    );
}
