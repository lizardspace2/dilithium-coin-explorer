import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "neon-blue": "#00f3ff",
                "neon-purple": "#bc13fe",
                "glass-border": "rgba(255, 255, 255, 0.1)",
                "glass-bg": "rgba(10, 10, 20, 0.6)",
            },
            fontFamily: {
                sans: ['var(--font-inter)'], // We will set this up in layout.tsx
                mono: ['var(--font-mono)'],
                space: ['var(--font-space)'],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};
export default config;
