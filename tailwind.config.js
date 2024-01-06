/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/newUIComponents/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#5178c2',
        'brand-primary-light': '#eef2f9',
        'brand-secondary': '#f6ce46',
        'text-secondary': '#a9a9a9',
        danger: '#b00020',
        'border-color': '#a9a9a9',
        'grid-background-alt': '#f5f5f5',
      },
      boxShadow: {
        panel: '0 0 16px 0 rgba(17, 17, 26, 0.05);',
        modal: [
          'rgba(17, 17, 26, 0.1) 0px 8px 24px',
          'rgba(17, 17, 26, 0.1) 0px 16px 56px',
          'rgba(17, 17, 26, 0.1) 0px 24px 80px',
        ],
      },
    },
  },
  plugins: [],
  // Remove later
  //prefix: "tw-",
};
