'use client';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';
import { I18nProvider } from '@/lib/i18n';
import { CartProvider } from '@/lib/cart';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <I18nProvider>
                <CartProvider>
                    {children}
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            className: 'toast-custom',
                            style: {
                                background: 'var(--bg-card)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--glass-border)',
                                backdropFilter: 'blur(15px)',
                            },
                            success: {
                                iconTheme: { primary: '#e0773d', secondary: '#fff' },
                            },
                        }}
                    />
                </CartProvider>
            </I18nProvider>
        </ThemeProvider>
    );
}
