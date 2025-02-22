/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'float1': 'float 10s ease-in-out infinite',
        'float2': 'float 12s ease-in-out infinite',
        'float3': 'float 14s ease-in-out infinite',
        'float4': 'float 16s ease-in-out infinite',
        'float5': 'float 18s ease-in-out infinite',
        'float6': 'float 20s ease-in-out infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        // Novas animações para o painel LED
        'marquee': 'marquee 30s linear infinite',
        'blink': 'blink 1s ease-in-out infinite',
        'led-pulse': 'led-pulse 2s ease-in-out infinite',
        'text-slide': 'text-slide 0.5s ease-out',
        'glow': 'glow 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '25%': { transform: 'translateY(-20px) translateX(20px)' },
          '50%': { transform: 'translateY(20px) translateX(-20px)' },
          '75%': { transform: 'translateY(-10px) translateX(10px)' },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        // Novos keyframes para o painel LED
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        'led-pulse': {
          '0%, 100%': {
            textShadow: '0 0 5px currentColor',
            filter: 'brightness(1)'
          },
          '50%': {
            textShadow: '0 0 20px currentColor',
            filter: 'brightness(1.2)'
          }
        },
        'text-slide': {
          '0%': {
            transform: 'translateY(100%)',
            opacity: '0'
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1'
          }
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 5px currentColor',
          },
          '50%': {
            boxShadow: '0 0 20px currentColor',
          }
        }
      },
      // Configuração de breakpoints personalizada
      screens: {
        'xs': '360px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Container padrão
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
}