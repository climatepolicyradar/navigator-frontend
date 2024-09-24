/** @type {import('tailwindcss').Config} */

const MAX_SITE_WIDTH = "1440px";
const MAX_CONTENT_WIDTH = "800px";
const MAX_SIDEBAR_WIDTH = "300px";

module.exports = {
  content: [
    "./src/components/**/*.{ts,tsx,js,jsx}",
    "./src/pages/**/*.{ts,tsx,js,jsx}",
    "./src/sites/**/*.{ts,tsx,js,jsx}",
    "./themes/cpr/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    colors: {
      white: "#FFFFFF",
      black: "#000000",
      transparent: "transparent",
      current: "currentColor",
      textDark: "#202020",
      textNormal: "#505050",
      cpr: {
        dark: "#071e4a",
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
      red: {
        50: "#fef1ef",
        100: "#FEE4E2",
        200: "#FECEC7",
        300: "#FDA29B",
        600: "#D92D20",
        700: "#B42318",
        800: "#912018",
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
    },
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      borderRadius: {
        "4xl": "30px",
      },
      boxShadow: {
        xs: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      },
      flexBasis: {
        "1/2-gap-4": "calc(50% - (1/2 * 1rem))",
        "1/3-gap-4": "calc(33.3% - (2/3 * 1rem))",
        "1/4-gap-4": "calc(25% - (3/4 * 1rem))",
        "1/6-gap-4": "calc(16.6% - (5/6 * 1rem))",
        maxContent: MAX_CONTENT_WIDTH,
      },
      fontSize: {
        h1: "48px",
        h2: "30px",
        h3: "20px",
        h4: "21px",
        h5: "18px",
        h6: "16px",
      },
      letterSpacing: {
        slight: "0.015em",
      },
      maxWidth: {
        maxSiteWidth: MAX_SITE_WIDTH, // max width of the site
        maxContent: MAX_CONTENT_WIDTH, // central content area
        maxSidebar: MAX_SIDEBAR_WIDTH,
      },
      width: {
        maxSiteWidth: MAX_SITE_WIDTH, // max width of the site
        maxContent: MAX_CONTENT_WIDTH, // central content area
        maxSidebar: MAX_SIDEBAR_WIDTH,
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("tailwind-scrollbar")],
  variants: {
    scrollbar: ["rounded"],
  },
};
