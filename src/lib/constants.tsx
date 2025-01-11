export const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL

export const Logo = ({
	width = 100,
	height = 100,
}: {
	width?: number
	height?: number
}) => (
	<div className='border-2 rounded-full border-primary'>
		<svg
			xmlns='http://www.w3.org/2000/svg'
			height={height}
			width={width}
			viewBox='0 0 100 100'
			role='img'
			aria-label='SphereFusion Logo'
			className='rounded-full'
		>
			{/* Circle */}
			<circle cx='100' cy='100' r='80' fill='var(--logo-circle-bg)' />

			{/* Stripes */}
			<path
				d='M40 100c20-30 60-30 80 0M40 120c20-20 60-20 80 0M40 140c20-10 60-10 80 0'
				fill='none'
				stroke='var(--logo-stripes-color)'
				strokeWidth='4'
			/>
		</svg>
	</div>
)
