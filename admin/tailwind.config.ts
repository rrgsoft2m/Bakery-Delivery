import type { Config } from "tailwindcss";
const config: Config = {
    content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                bakery: { 50: "#fdf6f0", 100: "#faeadb", 200: "#f5d2b5", 300: "#eeb58a", 400: "#e6925c", 500: "#e0773d", 600: "#d15f32", 700: "#ae492b", 800: "#8b3c29", 900: "#713324" },
            },
            fontFamily: { inter: ["Inter", "sans-serif"] },
        },
    },
    plugins: [],
};
export default config;
