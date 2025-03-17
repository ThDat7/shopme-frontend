/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1677ff',
          dark: '#0958d9',
          light: '#69b1ff',
        },
        success: {
          DEFAULT: '#52c41a',
          dark: '#389e0d',
          light: '#95de64',
        },
        warning: {
          DEFAULT: '#faad14',
          dark: '#d48806',
          light: '#ffd666',
        },
        error: {
          DEFAULT: '#ff4d4f',
          dark: '#cf1322',
          light: '#ff7875',
        },
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
}
