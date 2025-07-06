// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        georgia: ['Georgia', 'serif'],
        times: ['"Times New Roman"', 'serif'],
        arial: ['Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
