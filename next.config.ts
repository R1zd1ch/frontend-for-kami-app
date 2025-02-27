import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	typescript: {
		ignoreBuildErrors: true, // Игнорировать ошибки TypeScript
	},
	eslint: {
		ignoreDuringBuilds: true, // Игнорировать ошибки ESLint во время сборки
	},
	async headers() {
		return [
			{
				source: '/api/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Origin', value: '*' },
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
				],
			},
		]
	},
	images: {
		domains: [
			'books.google.com',
			'example.com',
			'res.cloudinary.com',
			'via.placeholder.com',
			'picsum.photos',
			'i.ibb.co',
		],
	},
}

export default nextConfig
