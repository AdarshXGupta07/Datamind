/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        surface: {
          0: "#060608",
          1: "#0d0d12",
          2: "#12121a",
          3: "#1a1a24",
          4: "#22222e",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s ease-out infinite",
        "data-flow": "data-flow 3s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "scan": "scan-line 3s linear infinite",
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-12px) rotate(1deg)" },
          "66%": { transform: "translateY(-6px) rotate(-1deg)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(99,102,241,0.4)" },
          "70%": { boxShadow: "0 0 0 12px rgba(99,102,241,0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(99,102,241,0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "scan-line": {
          "0%": { top: "-2px" },
          "100%": { top: "100%" },
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #22d3ee 100%)",
        "gradient-card": "linear-gradient(145deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.04) 100%)",
        "grid-pattern": "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.3)",
        "glow": "0 0 40px rgba(99,102,241,0.2)",
        "glow-strong": "0 0 80px rgba(99,102,241,0.35)",
        "glow-sm": "0 0 20px rgba(99,102,241,0.15)",
      },
    },
  },
  plugins: [],
};
