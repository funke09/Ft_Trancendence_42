const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
	'./src/utils/**/*.{js,ts,jsx,tsx,mdx}',
	'./src/**/*.{tsx, ts}',
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
		backgroundImage: {
			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			'gradient-conic':
			'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      	},
		screens: {
			'samwil': '960px',
		}
    },
	font: {
		'manrope': ['Manrope']
	}
  },
  plugins: [],
});
