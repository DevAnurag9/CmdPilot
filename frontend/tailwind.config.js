/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "rgba(148, 163, 184, 0.2)",
        background: "#05070d",
        foreground: "#f8fafc",
      },
      boxShadow: {
        glow: "0 0 80px rgba(34, 211, 238, 0.18)",
      },
    },
  },
  plugins: [],
};
