/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}", // ✅ App router files
    "./src/components/**/*.{js,ts,jsx,tsx}", // ✅ Just in case
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
