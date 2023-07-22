/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8460d4",
        "primary-light": "#42438f",
        "primary-dark": "#292975",
        secondary: "#fcfcfd",
        "secondary-dark": "#f3f4f6",
        border: "#E6E6E6",
      },
      borderRadius: {
        custom: "20px",
      },
    },
  },
  plugins: [],
};
