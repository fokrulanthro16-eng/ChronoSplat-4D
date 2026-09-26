import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        xrCyan: '#00f3ff',
        xrPurple: '#9d4edd',
        xrDark: '#080811',
      },
    },
  },
  plugins: [],
};
export default config;
