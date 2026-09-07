/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // "Generative studio" palette — deep space-black canvas with a vibrant
        // iris→pink→amber signal gradient. Token names are unchanged so every
        // existing page (login, pricing, studio) inherits the new look for free.
        ink: "#07070C",       // base background — deep, cool near-black
        panel: "#111119",     // raised surface base (cards use glass over this)
        rail: "#26263A",      // hairline borders / dividers
        paper: "#F5F4FF",     // primary text — bright, faintly cool white
        mute: "#9B99B5",      // secondary text
        amberDim: "#8A6526",
        // Accent trio driven by CSS variables (set in globals.css, switchable
        // via [data-theme] — see the Appearance page) so opacity utilities
        // like bg-iris/25 keep working through `rgb(var(--x) / <alpha>)`.
        amber: "rgb(var(--amber) / <alpha-value>)",
        iris: "rgb(var(--iris) / <alpha-value>)",
        pink: "rgb(var(--pink) / <alpha-value>)",
        cyan: "rgb(var(--cyan) / <alpha-value>)",
        okay: "#4ADE80",      // status: completed
        warn: "#FBBF24",      // status: processing
        bad: "#F76A6A",       // status: failed
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        md: "14px",
        lg: "20px",
        xl: "28px",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(124, 92, 255, 0.45)",
        "glow-amber": "0 0 40px -8px rgba(255, 178, 62, 0.45)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(4%, -6%) scale(1.1)" },
          "66%": { transform: "translate(-5%, 4%) scale(0.95)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        drift: "drift 18s ease-in-out infinite",
        "drift-slow": "drift 26s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-ring": "pulse-ring 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

module.exports = config;
