/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: "#fdf8f3",
          100: "#f6eedd",
          200: "#f0e5cd",
        },
        brown: {
          50: "#fff7f3",
          100: "#fef3ec",
          200: "#fde6e0",
          300: "#fbcfe8",
          400: "#f9a8d4",
          500: "#db2777",
          600: "#be185d",
          700: "#9d174d",
          800: "#811234",
          900: "#650721",
        }
      },
    },
  },
  plugins: [],
}