/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/pages/**/*.{ts,tsx,js,jsx}",
    "./src/sites/**/*.{ts,tsx,js,jsx}",
    "./themes/cclw/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      transparent: "transparent",
      current: "currentColor",
      cpr: {
        dark: "#071E4A",
      },
      cclw: {
        dark: "#2E3152",
        light: "#414466",
        molten: "#ED3D48",
      },
      gray: {
        25: "#FCFCFD",
        50: "#F9FAFB",
        100: "#F2F4F7",
        200: "#E4E7EC",
        300: "#D0D5DD",
        500: "#667085",
        600: "#475467",
        700: "#344054",
        800: "#1D2939",
      },
      blue: {
        50: "#e9f4ff",
        100: "#d2e9ff",
        200: "#a5d4ff",
        300: "#79beff",
        400: "#1F93FF",
        500: "#1F93FF",
        600: "#1F93FF",
        700: "#0075E3",
        800: "#005CB2",
        900: "#00417D",
      },
      blueGray: {
        700: "#394B6E",
        800: "#071E4A",
      },
      red: {
        50: "#fef1ef",
        100: "#FEE4E2",
        200: "#FECEC7",
        300: "#FDA29B",
        600: "#D92D20",
        700: "#B42318",
        800: "#912018",
      },
      orange: {
        50: "#FFF6ED",
        100: "#FFEAD5",
        200: "#FDDCAB",
        300: "#FEB273",
        600: "#EC4A0A",
        700: "#C4320A",
        800: "#9C2A10",
      },
      yellow: {
        50: "#FFFAEB",
        100: "#FEF0C7",
        200: "#FEDF89",
        300: "#FEC84B",
        600: "#DC6803",
        700: "#B54708",
        800: "#93370D",
      },
      green: {
        50: "#ECFDF3",
        100: "#D1FADF",
        200: "#A6F4C5",
        500: "#6CE9A6",
        600: "#039855",
        700: "#027A48",
        800: "#05603A",
      },
      purple: {
        50: "#F4F3FF",
        100: "#E7DEFE",
        200: "#cebefc",
        300: "#b69dfb",
        600: "#855CF8",
        700: "#9B8AFB",
        800: "#9B8AFB",
      },
    },
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      spacing: {
        150: "150%",
      },
      boxShadow: {
        xs: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      },
      fontSize: {
        h1: "48px",
        h2: "36px",
        h3: "20px",
        h4: "21px",
        h5: "18px",
        h6: "16px",
      },
      borderRadius: {
        "4xl": "30px",
      },
      letterSpacing: {
        slight: "0.015em",
      },
      flexBasis: {
        "1/2-gap-4": "calc(50% - (1/2 * 1rem))",
        "1/3-gap-4": "calc(33.3% - (2/3 * 1rem))",
        "1/4-gap-4": "calc(25% - (3/4 * 1rem))",
        "1/6-gap-4": "calc(16.6% - (5/6 * 1rem))",
      },
      fontWeight: {
        medium: 700,
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")],
  variants: {
    scrollbar: ["rounded"],
  },
};
