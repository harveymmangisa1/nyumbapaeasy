/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2D3748',
        secondary: '#4A5568',
        accent: '#38B2AC',
        background: '#F7FAFC',
        surface: '#FFFFFF',
        'text-primary': '#1A202C',
        'text-secondary': '#718096',
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
