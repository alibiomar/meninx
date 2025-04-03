export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',   // Tailwind will scan all pages
    './components/**/*.{js,ts,jsx,tsx}',   // Tailwind will scan all components
    './layouts/**/*.{js,ts,jsx,tsx}',    // If you have a layouts folder, include it
    './src/**/*.{js,ts,jsx,tsx}',        // If your components or pages are inside a src folder
    './app/**/*.{js,ts,jsx,tsx}',        // If you have an "app" folder or any other subfolder
  ],
  theme: {
    extend: {
      animation: {
        'text-shine': 'shine 3s ease-in-out infinite',
        blob: "blob 7s infinite",
        "blob-delay-2000": "blob 3s infinite 2s",
        "blob-delay-1000": "blob 2s infinite 1s",
      },
      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(20px, -100px) scale(1.5)" },
        },
        shine: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '0% center' },
        }
      }
    }
  },
  plugins: []
};