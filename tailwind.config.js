/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
      colors: {
        surface: '#f4f7fb',
        line: '#dbe3ef',
        ink: '#0f172a',
        brand: '#2563eb',
      },
    },
  },
  plugins: [],
}
