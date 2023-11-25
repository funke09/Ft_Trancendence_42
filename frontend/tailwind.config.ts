import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
	'./src/utils/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
	colors: {
		transparent: 'transparent',
		'white': '#ffffff',
		'purple': '#3f3cbb',
		'midnight': '#121063',
		'metal': '#565584',
		'tahiti': '#3ab7bf',
		'silver': '#ecebff',
		'bubble-gum': '#ff77e9',
		'bermuda': '#78dcca',
		'primary1' : '#3B2A3D'
	  },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
