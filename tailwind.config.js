/* eslint-disable */
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-01": "#023535",
        "primary-01.5": "#034545",
        "primary-02": "#00635A",
        "primary-03": "#39847D",
        "primary-04": "#32A89C",
        "primary-05": "#93BFB7",
        "neutral-01": "#404040",
        "neutral-02": "#595959",
        "neutral-03": "#D9D9D9",
        "neutral-04": "#F2F2F2",
        "error": "#D92525",
        "warning": "#F28705",
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}