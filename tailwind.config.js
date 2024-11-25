/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-mode="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "pineapple": "url('/phulae.jpg')",

      },
      keyframes: {
        slideFadeIn: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' }, // เริ่มจากตำแหน่งด้านซ้าย
          '100%': { opacity: '1', transform: 'translateX(0)' },  // เคลื่อนที่เข้าและแสดงผล
        },
        slideFadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' }, // Slide-in จากด้านขวา
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      
      animation: {
        slideFadeInRight: 'slideFadeInRight 1.5s ease-in-out',
        slideFadeIn: 'slideFadeIn 1.5s ease-in-out', // ระยะเวลาและ easing
      },
    },
  },
  plugins: [],
};
