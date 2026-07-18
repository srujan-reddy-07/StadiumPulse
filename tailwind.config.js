/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                stadium: {
                    emerald: "#0D9488", // Lawn Green
                    dark: "#064E3B",
                    light: "#CCFBF1",
                },
                fifa: {
                    gold: "#F59E0B", // Alert & Highlights
                    goldDark: "#B45309",
                    indigo: "#4F46E5", // Deep Championship Indigo
                    slate: "#0F172A", // Dark Command Center background
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}