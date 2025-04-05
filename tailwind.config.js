export default {
    darkMode: ['class'],
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
  			'text-shine': 'shine 4s ease-in-out',
  			blob: 'blob 7s infinite',
  			'blob-delay-2000': 'blob 3s infinite 2s',
  			'blob-delay-1000': 'blob 2s infinite 1s'
  		},
  		keyframes: {
  			blob: {
  				'0%, 100%': {
  					transform: 'translate(0, 0) scale(1)'
  				},
  				'50%': {
  					transform: 'translate(20px, -100px) scale(1.5)'
  				}
  			},
  			shine: {
  				'0%': {
  					backgroundPosition: '200% center'
  				},
  				'100%': {
  					backgroundPosition: '0% center'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
};