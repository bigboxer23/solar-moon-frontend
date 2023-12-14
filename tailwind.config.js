/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/components/newUIComponents/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-primary": "#5178c2",
        "brand-primary-light": "#eef2f9",
        "brand-secondary": "#f6ce46",
        "text-secondary": "#a9a9a9",
        danger: "#b00020",
        "border-color": "#a9a9a9",
      },
      boxShadow: {
        panel: "0 0 16px 0 rgba(17, 17, 26, 0.05);",
      },
    },
  },
  plugins: [],
  // Remove later
  //prefix: "tw-",
};
