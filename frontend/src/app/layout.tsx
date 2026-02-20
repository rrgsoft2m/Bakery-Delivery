import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
    title: "Shirinliklar | Bakery Delivery",
    description: "Eng mazali shirinliklar — eshigingizgacha yetkazib beramiz. Tortlar, kruassanlar, non va boshqa shirinliklar.",
    keywords: "bakery, delivery, cake, croissant, tashkent, uzbekistan, shirinliklar",
    openGraph: {
        title: "Shirinliklar | Bakery Delivery",
        description: "Yangi pishirilgan tortlar va shirinliklar",
        type: "website",
    },
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    themeColor: "#e0773d",
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="uz" suppressHydrationWarning>
            <head>
                <script src="https://telegram.org/js/telegram-web-app.js" defer />
            </head>
            <body className="antialiased">
                <Providers>
                    <div className="bg-pattern" />
                    <div className="relative z-10">
                        {children}
                    </div>
                </Providers>
            </body>
        </html>
    );
}
