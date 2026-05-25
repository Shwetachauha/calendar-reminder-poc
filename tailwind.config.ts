import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: "#087f8c",
        accent: "#ff5d73",
      },
      boxShadow: {
        soft: "0 12px 28px -12px rgba(8, 127, 140, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
