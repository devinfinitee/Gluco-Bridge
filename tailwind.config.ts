import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      colors: {
        // Base colors
        background: "hsl(var(--background) / <alpha-value>)",
        "on-background": "hsl(var(--on-background) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        "on-surface": "hsl(var(--on-surface) / <alpha-value>)",
        "on-surface-variant": "hsl(var(--on-surface-variant) / <alpha-value>)",
        "surface-variant": "hsl(var(--surface-variant) / <alpha-value>)",
        "surface-dim": "hsl(var(--surface-dim) / <alpha-value>)",
        "surface-bright": "hsl(var(--surface-bright) / <alpha-value>)",
        "surface-container-lowest": "hsl(var(--surface-container-lowest) / <alpha-value>)",
        "surface-container-low": "hsl(var(--surface-container-low) / <alpha-value>)",
        "surface-container": "hsl(var(--surface-container) / <alpha-value>)",
        "surface-container-high": "hsl(var(--surface-container-high) / <alpha-value>)",
        "surface-container-highest": "hsl(var(--surface-container-highest) / <alpha-value>)",
        "inverse-surface": "hsl(var(--inverse-surface) / <alpha-value>)",
        "inverse-on-surface": "hsl(var(--inverse-on-surface) / <alpha-value>)",
        "surface-tint": "hsl(var(--surface-tint) / <alpha-value>)",

        // Primary colors
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          "on-primary": "hsl(var(--on-primary) / <alpha-value>)",
          fixed: "hsl(var(--primary-fixed) / <alpha-value>)",
          "fixed-dim": "hsl(var(--primary-fixed-dim) / <alpha-value>)",
          "on-fixed": "hsl(var(--on-primary-fixed) / <alpha-value>)",
          "on-fixed-variant": "hsl(var(--on-primary-fixed-variant) / <alpha-value>)",
          container: "hsl(var(--primary-container) / <alpha-value>)",
          "on-container": "hsl(var(--on-primary-container) / <alpha-value>)",
        },

        // Secondary colors
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          "on-secondary": "hsl(var(--on-secondary) / <alpha-value>)",
          fixed: "hsl(var(--secondary-fixed) / <alpha-value>)",
          "fixed-dim": "hsl(var(--secondary-fixed-dim) / <alpha-value>)",
          "on-fixed": "hsl(var(--on-secondary-fixed) / <alpha-value>)",
          "on-fixed-variant": "hsl(var(--on-secondary-fixed-variant) / <alpha-value>)",
          container: "hsl(var(--secondary-container) / <alpha-value>)",
          "on-container": "hsl(var(--on-secondary-container) / <alpha-value>)",
        },

        // Tertiary colors
        tertiary: {
          DEFAULT: "hsl(var(--tertiary) / <alpha-value>)",
          "on-tertiary": "hsl(var(--on-tertiary) / <alpha-value>)",
          fixed: "hsl(var(--tertiary-fixed) / <alpha-value>)",
          "fixed-dim": "hsl(var(--tertiary-fixed-dim) / <alpha-value>)",
          "on-fixed": "hsl(var(--on-tertiary-fixed) / <alpha-value>)",
          "on-fixed-variant": "hsl(var(--on-tertiary-fixed-variant) / <alpha-value>)",
          container: "hsl(var(--tertiary-container) / <alpha-value>)",
          "on-container": "hsl(var(--on-tertiary-container) / <alpha-value>)",
        },

        // Error colors
        error: {
          DEFAULT: "hsl(var(--error) / <alpha-value>)",
          "on-error": "hsl(var(--on-error) / <alpha-value>)",
          container: "hsl(var(--error-container) / <alpha-value>)",
          "on-container": "hsl(var(--on-error-container) / <alpha-value>)",
        },

        // Outline colors
        outline: "hsl(var(--outline) / <alpha-value>)",
        "outline-variant": "hsl(var(--outline-variant) / <alpha-value>)",

        // Inverse colors
        "inverse-primary": "hsl(var(--inverse-primary) / <alpha-value>)",

        // Legacy / compatibility
        foreground: "hsl(var(--on-background) / <alpha-value>)",
        border: "hsl(var(--outline-variant) / <alpha-value>)",
        input: "hsl(var(--surface-container) / <alpha-value>)",
        
        card: {
          DEFAULT: "hsl(var(--surface-container) / <alpha-value>)",
          foreground: "hsl(var(--on-surface) / <alpha-value>)",
          border: "hsl(var(--outline-variant) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--surface-container-highest) / <alpha-value>)",
          foreground: "hsl(var(--on-surface) / <alpha-value>)",
          border: "hsl(var(--outline-variant) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--surface-container) / <alpha-value>)",
          foreground: "hsl(var(--on-surface-variant) / <alpha-value>)",
          border: "hsl(var(--outline-variant) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--primary-fixed) / <alpha-value>)",
          foreground: "hsl(var(--on-primary-fixed) / <alpha-value>)",
          border: "hsl(var(--primary-container) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--error) / <alpha-value>)",
          foreground: "hsl(var(--on-error) / <alpha-value>)",
          border: "hsl(var(--error-container) / <alpha-value>)",
        },
        ring: "hsl(var(--primary) / <alpha-value>)",
        chart: {
          "1": "hsl(var(--primary) / <alpha-value>)",
          "2": "hsl(var(--secondary) / <alpha-value>)",
          "3": "hsl(var(--tertiary) / <alpha-value>)",
          "4": "hsl(var(--error) / <alpha-value>)",
          "5": "hsl(var(--primary-container) / <alpha-value>)",
        },
        sidebar: {
          ring: "hsl(var(--primary) / <alpha-value>)",
          DEFAULT: "hsl(var(--surface-container-lowest) / <alpha-value>)",
          foreground: "hsl(var(--on-surface) / <alpha-value>)",
          border: "hsl(var(--outline-variant) / <alpha-value>)",
        },
        "sidebar-primary": {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--on-primary) / <alpha-value>)",
          border: "hsl(var(--primary-container) / <alpha-value>)",
        },
        "sidebar-accent": {
          DEFAULT: "hsl(var(--secondary-container) / <alpha-value>)",
          foreground: "hsl(var(--on-secondary-container) / <alpha-value>)",
          border: "hsl(var(--secondary) / <alpha-value>)"
        },
        status: {
          online: "rgb(34 197 94)",
          away: "rgb(245 158 11)",
          busy: "rgb(239 68 68)",
          offline: "rgb(156 163 175)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
