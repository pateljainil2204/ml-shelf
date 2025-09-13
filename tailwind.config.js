/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#3b82f6',   // blue-500
          dark: '#1e40af',    // blue-800
        },
        accent: '#f59e42', // orange-400
        background: '#f9fafb', // gray-50
        card: '#fff',
        border: '#e5e7eb', // gray-200
      },
      borderRadius: {
        xl: '1.25rem',
      },
      boxShadow: {
        card: '0 4px 24px 0 rgba(37, 99, 235, 0.08)',
      },
    },
  },
  plugins: [],
};
