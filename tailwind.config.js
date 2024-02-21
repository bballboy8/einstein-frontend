/** @type {import('tailwindcss').Config} */

const { nextui } = require("@nextui-org/react");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      width: {
        "xl": 'calc(100vw - 400px)',
        "mlg" : "calc(100vw - 20px)"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "radial-gradient":
          "radial-gradient(101.33% 101.33% at 50% 50%, #6F6F6F 0%, rgba(93, 93, 93, 0.15) 100%)"
      },
      fontFamily: {
        nasalization: "var(--font-nasalization)",
        helvetica: "var(--font-helvetica)",
        helvetica_neue: "var(--font-helvetica_neue)",
        montserrat: "var(--font-montserrat)",
        inter: "var(--font-inter)"
      },
      screens: {
        msm: '500px',
        // "msm-max": {max: "501px"},
        sm: "641px",
        // "sm-max": {max: "641px"},
        md: "769px",
        mlg: "961px",
        // "md-max": { max: "770px" },
        lg: "1024px",
        // "mxl-max": { max: "1441px" },
        mxl: "1441px",
        xl: "1280px",
        // "xl-max": {max: "1280px"},
        mxl: "1441px",
        "2xl": "1536px",
        lxl: "1710px",
      },
      aspectRatio: {
        '1/1': '1 / 1',
        '9/7': '9 / 7',
        '19/13': '19 / 13',
        '7/4': '7 / 4',
        '7/9': '7 / 9',
        '13/19': '13 / 19',
        '4/7': '4 / 7',
        '5/12': '5 / 12',
      },
    }
  },
  darkMode: "class",
  plugins: [nextui()]
};
