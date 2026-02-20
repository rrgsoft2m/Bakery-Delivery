'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { getProducts } from '@/lib/api';
import ProductCard from './ProductCard';

const categories = ['all', 'cakes', 'pastries', 'bread', 'cookies', 'drinks', 'special'] as const;

// Fallback sample products (used when API is unavailable)
const sampleProducts = [
    {
        _id: '1', name: { uz: "Shokoladli tort", ru: "Шоколадный торт", en: "Chocolate Cake" },
        description: { uz: "Yumshoq shokoladli biskvit, qatlamli krem bilan", ru: "Нежный шоколадный бисквит со слоями крема", en: "Soft chocolate sponge with layers of cream" },
        price: 120000, category: "cakes", imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500", isAvailable: true
    },
    {
        _id: '2', name: { uz: "Qulupnayli tort", ru: "Клубничный торт", en: "Strawberry Cake" },
        description: { uz: "Yangi qulupnaylar va vanil kremi bilan", ru: "Со свежей клубникой и ванильным кремом", en: "With fresh strawberries and vanilla cream" },
        price: 150000, category: "cakes", imageUrl: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500", isAvailable: true
    },
    {
        _id: '3', name: { uz: "Kruassan", ru: "Круассан", en: "Croissant" },
        description: { uz: "Fransuz uslubidagi oltin kruassan", ru: "Золотистый круассан по-французски", en: "Golden French-style croissant" },
        price: 25000, category: "pastries", imageUrl: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=500", isAvailable: true
    },
    {
        _id: '4', name: { uz: "Makaron", ru: "Макарон", en: "Macaron" },
        description: { uz: "Rangli va mazali fransuz makaronlari", ru: "Разноцветные и вкусные французские макароны", en: "Colorful and delicious French macarons" },
        price: 15000, category: "cookies", imageUrl: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500", isAvailable: true
    },
    {
        _id: '5', name: { uz: "Tiramisu", ru: "Тирамису", en: "Tiramisu" },
        description: { uz: "Klassik italyan tiramisu desserti", ru: "Классический итальянский десерт тирамису", en: "Classic Italian tiramisu dessert" },
        price: 80000, category: "special", imageUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500", isAvailable: true
    },
    {
        _id: '6', name: { uz: "Non", ru: "Лепёшка", en: "Tandoori Bread" },
        description: { uz: "An'anaviy o'zbek tandirda pishirilgan non", ru: "Традиционный узбекский хлеб из тандыра", en: "Traditional Uzbek bread baked in tandoor" },
        price: 8000, category: "bread", imageUrl: "https://images.unsplash.com/photo-1549931319-a545753467c8?w=500", isAvailable: true
    },
    {
        _id: '7', name: { uz: "Latté", ru: "Латте", en: "Latte" },
        description: { uz: "Yumshoq sutli kofe – latte", ru: "Нежный молочный кофе — латте", en: "Smooth milky coffee – latte" },
        price: 30000, category: "drinks", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500", isAvailable: true
    },
    {
        _id: '8', name: { uz: "Eklér", ru: "Эклер", en: "Eclair" },
        description: { uz: "Shokoladli glazurli klassik fransuz ekléri", ru: "Классический французский эклер с шоколадной глазурью", en: "Classic French eclair with chocolate glaze" },
        price: 20000, category: "pastries", imageUrl: "https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500", isAvailable: true
    },
    {
        _id: '9', name: { uz: "Red Velvet tort", ru: "Торт Ред Вельвет", en: "Red Velvet Cake" },
        description: { uz: "Qizil baxmal tort krem-syr bilan", ru: "Торт красный бархат с кремом из сливочного сыра", en: "Red velvet cake with cream cheese frosting" },
        price: 180000, category: "cakes", imageUrl: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=500", isAvailable: true
    },
    {
        _id: '10', name: { uz: "Cheesecake", ru: "Чизкейк", en: "Cheesecake" },
        description: { uz: "Nyu-York uslubidagi klassik cheesecake", ru: "Классический чизкейк в нью-йоркском стиле", en: "Classic New York style cheesecake" },
        price: 95000, category: "special", imageUrl: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500", isAvailable: true
    },
    {
        _id: '11', name: { uz: "Shokoladli keks", ru: "Шоколадный кекс", en: "Chocolate Muffin" },
        description: { uz: "Yumshoq va mazali shokoladli keks", ru: "Мягкий и вкусный шоколадный кекс", en: "Soft and delicious chocolate muffin" },
        price: 18000, category: "cookies", imageUrl: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=500", isAvailable: true
    },
    {
        _id: '12', name: { uz: "Kapuchino", ru: "Капучино", en: "Cappuccino" },
        description: { uz: "Italyan kapuchino – ko'pikli kofe", ru: "Итальянский капучино — кофе с пенкой", en: "Italian cappuccino – foamy coffee" },
        price: 28000, category: "drinks", imageUrl: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500", isAvailable: true
    },
];

export default function ProductGrid() {
    const { t, locale } = useI18n();
    const [products, setProducts] = useState<any[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProducts();
                setProducts(data);
            } catch {
                // Use sample data if API is not available
                setProducts(sampleProducts);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filtered = products.filter(p => {
        const matchCategory = activeCategory === 'all' || p.category === activeCategory;
        const matchSearch = searchTerm === '' ||
            p.name[locale]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description[locale]?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    return (
        <section id="products" className="py-16 sm:py-24 px-4 max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="font-playfair text-4xl sm:text-5xl font-bold mb-4 gradient-text">
                    {t('our_specialties')}
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-bakery-400 to-bakery-600 rounded-full mx-auto" />
            </motion.div>

            {/* Search + Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
            >
                {/* Search */}
                <div className="relative max-w-md mx-auto mb-8">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder={t('search')}
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl
              bg-[var(--bg-secondary)] border border-[var(--border)]
              text-[var(--text-primary)] placeholder-[var(--text-secondary)]
              focus:ring-2 focus:ring-bakery-500/20 transition-all"
                    />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                    {categories.map(cat => (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300
                ${activeCategory === cat
                                    ? 'bg-bakery-500 text-white shadow-lg shadow-bakery-500/30'
                                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-bakery-100 dark:hover:bg-bakery-900/20'
                                }`}
                        >
                            {t(cat as any)}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Product Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="glass-card overflow-hidden">
                            <div className="skeleton h-56 rounded-none" />
                            <div className="p-5 space-y-3">
                                <div className="skeleton h-4 w-3/4 rounded" />
                                <div className="skeleton h-3 w-full rounded" />
                                <div className="skeleton h-3 w-2/3 rounded" />
                                <div className="flex justify-between items-center mt-4">
                                    <div className="skeleton h-6 w-20 rounded" />
                                    <div className="skeleton h-10 w-24 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory + searchTerm}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    >
                        {filtered.map((product, i) => (
                            <ProductCard key={product._id} product={product} index={i} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            )}

            {!loading && filtered.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <span className="text-6xl block mb-4">🔍</span>
                    <p className="text-[var(--text-secondary)] text-lg">
                        {locale === 'uz' ? 'Mahsulot topilmadi' : locale === 'ru' ? 'Ничего не найдено' : 'No products found'}
                    </p>
                </motion.div>
            )}
        </section>
    );
}
