/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'twitter': {
          '50': '#f4fafe',
          '100': '#e8f6fe',
          '200': '#c7e8fc',
          '300': '#a5d9f9',
          '400': '#61bdf5',
          '500': '#1da1f1',
          '600': '#1a91d9',
          '700': '#1679b5',
          '800': '#116191',
          '900': '#15202B'
        }
      }
    }
  },
  plugins: [],
}
