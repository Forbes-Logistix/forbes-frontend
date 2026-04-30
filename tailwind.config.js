/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light beige tints used on a couple of background blocks. The full
        // brown palette that previously lived here was actually the Tailwind
        // pink-700/800 hex values mislabeled — removed to avoid the footgun.
        beige: {
          50: "#fdf8f3",
          100: "#f6eedd",
          200: "#f0e5cd",
        },
      },
    },
  },
  plugins: [],
};
