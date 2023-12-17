/** @type {import('next').NextConfig} */
module.exports = {
	images: {
		remotePatterns: [
		  {
			protocol: 'https',
			hostname: 'cdn.intra.42.fr',
		  },
		  {
			protocol: 'https',
			hostname: 'cdn-icons-png.flaticon.com',
		  },
		],
	  },
}
