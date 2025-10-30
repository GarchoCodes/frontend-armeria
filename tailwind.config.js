/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",           // tu HTML principal
        "./src/**/*.{js,ts,jsx,tsx}", // tus archivos JS/TS/React/Vue/etc.
    ],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
};
