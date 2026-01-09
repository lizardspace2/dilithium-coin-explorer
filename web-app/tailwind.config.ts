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
                "neon-green": "#0aff68",
                "glass-border": "rgba(255, 255, 255, 0.08)",
                "glass-bg": "rgba(255, 255, 255, 0.03)",
                "surface": "#0a0a12",
            },
            fontFamily: {
                sans: ['var(--font-inter)'], // We will set this up in layout.tsx
                mono: ['var(--font-mono)'],
                space: ['var(--font-space)'],
            },
            "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
            "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        },
        animation: {
            'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'float': 'float 6s ease-in-out infinite',
            'fade-in': 'fadeIn 0.5s ease-out forwards',
            'slide-up': 'slideUp 0.5s ease-out forwards',
        },
        keyframes: {
            float: {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-10px)' },
            },
            fadeIn: {
                '0%': { opacity: '0' },
                '100%': { opacity: '1' },
            },
            slideUp: {
                '0%': { opacity: '0', transform: 'translateY(10px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
            },
        },
    },
},
    plugins: [],
};
export default config;
