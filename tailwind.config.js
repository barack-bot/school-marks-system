/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#c7e1fd",
          300: "#a4c9fc",
          400: "#78aaf9",
          500: "#4a8af5",
          600: "#2d5be8",
          700: "#2447d5",
          800: "#1e38ad",
          900: "#1c2d85",
        },
        secondary: {
          50: "#f3f8fc",
          100: "#e8f1f8",
          200: "#d6e5f4",
          300: "#bdd4ed",
          400: "#9abce2",
          500: "#6d9fd6",
          600: "#5283c7",
          700: "#4470b3",
          800: "#3a5a93",
          900: "#334878",
        },
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.08)",
        medium: "0 4px 12px rgba(0, 0, 0, 0.12)",
        lg: "0 8px 24px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
