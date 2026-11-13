import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        linkedin: {
          primary: "#0A66C2",
          hover: "#004182",
          light: "#EBF4FD",
          canvas: "#F4F2EE",
          card: "#FFFFFF",
          border: "#E0DFDC",
          text: "#191919",
          muted: "#666666",
          success: "#057642",
          successBg: "#E8F5E9",
          warning: "#B24020",
          warningBg: "#FDF0ED",
          pill: "#EBEBEB",
        },
      },
      boxShadow: {
        linkedin: "0 0 0 1px rgba(140, 140, 140, 0.2)",
        "linkedin-hover": "0 4px 12px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
