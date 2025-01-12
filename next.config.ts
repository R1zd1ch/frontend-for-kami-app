import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	typescript: {
		ignoreBuildErrors: true, // Игнорировать ошибки TypeScript
	},
	eslint: {
		ignoreDuringBuilds: true, // Игнорировать ошибки ESLint во время сборки
	},
}

export default nextConfig
