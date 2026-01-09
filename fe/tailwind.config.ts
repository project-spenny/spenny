import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5C7AFF',
          strong: '#2E4BB3',
          soft: '#A3C2FF',
          subtle: '#F0F4FF',
          neutral: '#C6D0E2',
          disabled: '#CDCDCD',
        },
      },
    },
  },
  plugins: [],
};

export default config;
