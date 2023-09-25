/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skeletonHighLight: 'rgba(254,69,86,0.4)'
      }
    },
  },
  plugins: [],
}
