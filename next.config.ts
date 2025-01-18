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
}

export default nextConfig
