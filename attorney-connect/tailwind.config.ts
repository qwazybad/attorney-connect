import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50:  "#FFF8EC",
          100: "#FEEECE",
          200: "#FDD89A",
          300: "#FBBC5E",
          400: "#F9A232",
          500: "#C2800A",
          600: "#A06808",
          700: "#7D5006",
          800: "#5A3904",
          900: "#372202",
        },
        navy: {
          50:  "#F7F5F3",
          100: "#EDE9E5",
          200: "#D5CEC8",
          300: "#B8ADA5",
          400: "#8F8178",
          500: "#6B5D54",
          600: "#4D4239",
          700: "#352C25",
          800: "#221C17",
          900: "#141210",
          950: "#0A0908",
        },
        cream: {
          50:  "#FDFAF7",
          100: "#F5F0EB",
          200: "#EDE8E3",
          300: "#E0D9D1",
          400: "#CFC5BA",
        },
        gold: {
          50:  "#fdfaec",
          100: "#f9f0c6",
          200: "#f3e08b",
          300: "#ecc84b",
          400: "#e5b020",
          500: "#c9920f",
          600: "#a87209",
          700: "#865408",
          800: "#6e430b",
          900: "#5c370d",
        },
        gray: {
          50:  "#F5F5F7",
          100: "#E8E8ED",
          200: "#D2D2D7",
          300: "#AEAEB2",
          400: "#8E8E93",
          500: "#636366",
          600: "#48484A",
          700: "#3A3A3C",
          800: "#2C2C2E",
          900: "#1C1C1E",
          950: "#0A0A0A",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      animation: {
        "slide-up": "slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-up-delay-1": "slideUp 0.7s 0.1s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-up-delay-2": "slideUp 0.7s 0.2s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-up-delay-3": "slideUp 0.7s 0.3s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "float-slower": "float 12s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 20s linear infinite",
        "counter": "counter 2s ease-out forwards",
      },
      keyframes: {
        slideUp: {
          from: { opacity: "0", transform: "translateY(32px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":       { transform: "translateY(-20px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%":       { opacity: "0.8", transform: "scale(1.08)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":       { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to:   { backgroundPosition: "200% 0" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "card": "0 2px 20px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
        "glow-accent": "0 0 40px rgba(5,150,105,0.3)",
        "glow-sm": "0 0 20px rgba(5,150,105,0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
