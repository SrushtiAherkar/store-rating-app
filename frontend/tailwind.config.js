/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: "#F7374F", // Primary Red/Pink
                    dark: "#D6263D",
                },
                secondary: {
                    DEFAULT: "#88304E", // Burgundy
                },
                dark: {
                    DEFAULT: "#522546", // Dark Purple/Brown
                },
                neutral: {
                    DEFAULT: "#2C2C2C", // Dark Grey
                    light: "#E5E5E5",
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Professional font
            }
        },
    },
    plugins: [],
}
