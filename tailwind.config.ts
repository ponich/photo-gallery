import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                background: 'rgb(var(--background) / <alpha-value>)',
                foreground: 'rgb(var(--foreground) / <alpha-value>)',
                modal: {
                    DEFAULT: 'rgb(var(--modal-background) / <alpha-value>)',
                    foreground: 'rgb(var(--modal-foreground) / <alpha-value>)',
                },
                sidebar: {
                    DEFAULT: 'rgb(var(--sidebar-background) / <alpha-value>)',
                },
                button: {
                    DEFAULT: 'rgb(var(--button-background) / <alpha-value>)',
                    hover: 'rgb(var(--button-hover) / <alpha-value>)',
                },
            },
        },
    },
    plugins: [],
};

export default config;
