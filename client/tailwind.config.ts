module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          navy: '#1B263B',
          'navy-dark': '#0D1B2A',
          gold: '#FFD700'
        }
      }
    },
    plugins: [require('daisyui')],
    daisyui: {
      themes: ['light']
    }
  };