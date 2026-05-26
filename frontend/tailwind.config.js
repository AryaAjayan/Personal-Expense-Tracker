/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        foreground: '#f8fafc',
        card: '#1e293b',
        'card-foreground': '#f8fafc',
        primary: '#6366f1',
        'primary-foreground': '#ffffff',
        secondary: '#334155',
        'secondary-foreground': '#f8fafc',
        muted: '#334155',
        'muted-foreground': '#94a3b8',
        border: '#334155',
        input: '#334155',
        destructive: '#ef4444',
        'destructive-foreground': '#ffffff',
      }
    },
  },
  plugins: [],
}
