import type {Config} from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                "custom-1": "0 0 16px rgba(0, 0, 0, .16)",
            },
            colors: {
                "primary-1": "#F0F8FF",
                "primary-2": "#72A0C1",
                "primary-3": "#5D8AA8",
                "primary-4": "#003262",
                "primary-5": "#FFBF00",
                "x-player": "#007FFF",
                "o-player": "#FF0080",
            },
            animation: {
                "zoom-in-out": "zoomInOut 2s infinite",
                "gradient-move": "gradient-move 5s ease infinite",
            },
            keyframes: {
                zoomInOut: {
                    "0%, 100%": {transform: "scale(1)"},
                    "50%": {transform: "scale(1.2)"},
                },
                "gradient-move": {
                    "0%, 100%": {backgroundPosition: "0% 50%"},
                    "50%": {backgroundPosition: "100% 50%"},
                },
            },
        },
    },
    plugins: [require("daisyui")],
};
export default config;
