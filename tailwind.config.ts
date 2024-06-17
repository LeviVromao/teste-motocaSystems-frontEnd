import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
     colors: {
      "backgroundColor": "var(--dark-blue-background)",
      "light-grey": "var(--light-grey)",
      "light-blue": "var(--light-blue)",
     },
     spacement: {
      "margin-0-auto": "var(--margin-0-auto)",
     }
    },
  },
  plugins: [],
};
export default config;
