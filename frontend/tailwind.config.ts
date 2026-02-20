import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                bakery: {
                    50: "#fdf6f0",
                    100: "#faeadb",
                    200: "#f5d2b5",
                    300: "#eeb58a",
                    400: "#e6925c",
                    500: "#e0773d",
                    600: "#d15f32",
                    700: "#ae492b",
                    800: "#8b3c29",
                    900: "#713324",
                },
                cream: {
                    50: "#fefdfb",
                    100: "#fdf9f3",
                    200: "#faf0e3",
                    300: "#f5e3cd",
                    400: "#edd0aa",
                    500: "#e4b888",
                },
                chocolate: {
                    50: "#f9f6f3",
                    100: "#f0e8de",
                    200: "#e0cebb",
                    300: "#ccad91",
                    400: "#b98d6e",
                    500: "#a87756",
                    600: "#9b654b",
                    700: "#81503f",
                    800: "#6a4238",
                    900: "#583730",
                },
            },
            fontFamily: {
                playfair: ["Playfair Display", "serif"],
                inter: ["Inter", "sans-serif"],
            },
            animation: {
                "float": "float 6s ease-in-out infinite",
                "shimmer": "shimmer 2s linear infinite",
                "slide-up": "slideUp 0.5s ease-out",
                "fade-in": "fadeIn 0.5s ease-out",
                "bounce-in": "bounceIn 0.6s ease-out",
                "glow": "glow 2s ease-in-out infinite alternate",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                bounceIn: {
                    "0%": { transform: "scale(0.3)", opacity: "0" },
                    "50%": { transform: "scale(1.05)" },
                    "70%": { transform: "scale(0.9)" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                glow: {
                    "0%": { boxShadow: "0 0 5px rgba(224, 119, 61, 0.5)" },
                    "100%": { boxShadow: "0 0 20px rgba(224, 119, 61, 0.8)" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};

export default config;
