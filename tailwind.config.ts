import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        solana: {
          purple: "#9945FF",
          green: "#14F195",
          pink: "#DC1FFF",
          blue: "#00D4FF",
          dark: "#07070B",
          deep: "#0B0B14",
          card: "#11111D",
          surface: "#161625",
          border: "#1F1F33",
          muted: "#6B7280",
        },
      },
      backgroundImage: {
        "gradient-solana": "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
        "gradient-aurora":
          "linear-gradient(135deg, #9945FF 0%, #DC1FFF 50%, #14F195 100%)",
        "gradient-radial":
          "radial-gradient(circle at 50% 0%, rgba(153,69,255,0.18), transparent 60%)",
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
      boxShadow: {
        "glow-purple": "0 0 60px -10px rgba(153,69,255,0.5)",
        "glow-green": "0 0 60px -10px rgba(20,241,149,0.45)",
        "inner-light": "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["'Space Grotesk'", "Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      animation: {
        "float-slow": "float 8s ease-in-out infinite",
        "float-slower": "float 12s ease-in-out infinite",
        "gradient-x": "gradient-x 8s ease infinite",
        "fade-up": "fade-up 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "shimmer": "shimmer 2.2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "50%": { transform: "translate(20px,-30px) scale(1.05)" },
        },
        "gradient-x": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { "background-position": "-200% 0" },
          "100%": { "background-position": "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
