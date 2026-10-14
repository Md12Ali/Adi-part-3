/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./assets/app.js", "./assets/data.js", "./assets/examday.js", "./assets/sim.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "Hind Siliguri", "system-ui", "-apple-system", "Segoe UI", "sans-serif"]
      }
    }
  },
  plugins: []
};
