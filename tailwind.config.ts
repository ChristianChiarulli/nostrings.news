import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",

  theme: {
    // typography: {
    //   default: {
    //     css: {
    //       pre: true,
    //       code: true,
    //       "pre code": false,
    //       "code::before": false,
    //       "code::after": false,
    //     },
    //   },
    // },

    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
  ],
};
export default config;
