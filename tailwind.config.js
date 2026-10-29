/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5722',
          'orange-hover': '#F4511E',
          'orange-dark': '#E64A19',
          'orange-light': '#FFF3E0',
          coral: '#EA5B3E',
          'coral-light': '#FDEBE7',
          dark: '#1E222B',
          gray: '#80869A',
          'light-gray': '#F7F8F9',
          border: '#EBEBF0',
          input: '#F8F9FA',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        'floating': '0 10px 30px -4px rgba(255, 87, 34, 0.25)',
        'keypad': '0 1px 2px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
