/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'newyear-red': '#b30000',
        'newyear-gold': '#ffcf4d',
      },
      backgroundImage: {
        'ny-pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')",
      },
    },
  },
  plugins: [],
}
