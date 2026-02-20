'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import OrderSuccess from '@/components/OrderSuccess';
import Footer from '@/components/Footer';
import { useCart } from '@/lib/cart';

export default function Home() {
    const [showCheckout, setShowCheckout] = useState(false);
    const [completedOrder, setCompletedOrder] = useState<any>(null);
    const { setCartOpen } = useCart();

    const handleCheckout = () => {
        setCartOpen(false);
        setShowCheckout(true);
    };

    const handleOrderSuccess = (order: any) => {
        setShowCheckout(false);
        setCompletedOrder(order);
    };

    const handleBackToMenu = () => {
        setCompletedOrder(null);
    };

    if (completedOrder) {
        return <OrderSuccess order={completedOrder} onBack={handleBackToMenu} />;
    }

    return (
        <>
            <Header />
            <main>
                <Hero />
                <ProductGrid />
                <section id="about" className="py-16 px-4 max-w-5xl mx-auto">
                    <div className="glass-card p-8 sm:p-12 text-center">
                        <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-6 gradient-text">
                            🍰 <span className="text-[var(--text-primary)]">Bakery Delivery</span>
                        </h2>
                        <div className="text-[var(--text-secondary)] leading-relaxed max-w-2xl mx-auto text-left space-y-4">
                            <p className="text-center font-medium text-lg">
                                — bu nafis ta’m va yuqori sifatni qadrlaydiganlar uchun yaratilgan zamonaviy shirinliklar studiyasi.
                            </p>
                            <p>
                                Biz har kuni eng saralangan va tabiiy ingredientlardan foydalanib, yangi, xushbo‘y hamda ko‘ngilni quvontiradigan shirinliklar tayyorlaymiz. Har bir tort, kruassan va non mahsuloti mehr bilan, tajribali ustalar tomonidan nafis did va mukammal dizayn asosida pishiriladi.
                            </p>
                            <p>
                                🚚 <strong>Endi sevimli shirinliklaringizni uydan chiqmasdan buyurtma qiling</strong> — biz ularni issiq va yangi holatda eshigingizgacha yetkazib beramiz.
                            </p>
                            <div className="bg-[var(--bg-secondary)]/50 p-4 rounded-xl border border-[var(--border)]">
                                <p className="font-semibold mb-2">✨ Biz bilan siz:</p>
                                <ul className="space-y-2 list-none pl-1">
                                    <li>🎂 Nafis va bayramona tortlarni</li>
                                    <li>🥐 Yangi pishgan kruassan va desertlarni</li>
                                    <li>🍞 Xushbo‘y non va turli shirinliklarni</li>
                                </ul>
                                <p className="mt-2 text-sm italic">oson va tez buyurtma qilishingiz mumkin.</p>
                            </div>
                            <p className="text-center font-medium pt-2 text-[var(--accent)]">
                                💖 Har bir buyurtma — bu sizga ulashilgan shirin kayfiyat va quvonch demakdir.
                            </p>
                            <p className="text-center font-bold">
                                Bakery Delivery bilan har bir kuningiz yanada shirin va unutilmas bo‘lsin!
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
            <CartDrawer onCheckout={handleCheckout} />
            <CheckoutModal isOpen={showCheckout} onClose={() => setShowCheckout(false)} onSuccess={handleOrderSuccess} />
        </>
    );
}
