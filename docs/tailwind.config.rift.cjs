/**
 * Rift Tailwind preset
 * Import via presets: [require('./docs/tailwind.config.rift.cjs')]
 */
module.exports = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',
        surface: '#1A1A1A',
        'surface-hover': '#262626',
        border: '#333333',
        text: '#FFFFFF',
        'text-muted': '#A3A3A3',
        'text-subtle': '#737373',
        accent: '#00FF99',
        'accent-hover': '#00CC77',
        error: '#FF3333',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '6px',
        lg: '8px',
      },
      fontFamily: {
        sans: ['"Geist Sans"', '"Inter"', 'system-ui', 'sans-serif'],
      },
    },
  },
};
