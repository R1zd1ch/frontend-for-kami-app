import type { Metadata } from 'next'
import {
	// Geist,
	//  Geist_Mono,
	// Yanone_Kaffeesatz,
	// Sofia_Sans_Condensed,
	// Sofia_Sans_Semi_Condensed,
	// Sofia_Sans_Extra_Condensed,
	// Sofia_Sans,
	Inter,
} from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
export const dynamic = 'force-dynamic'

// const geistSans = Geist({
// 	variable: '--font-geist-sans',
// 	subsets: ['latin'],
// })

// const geistMono = Geist_Mono({
// 	variable: '--font-geist-mono',
// 	subsets: ['latin'],
// })
const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin', 'cyrillic'],
})

// const sofiaSansCondensed = Sofia_Sans_Condensed({
// 	variable: '--font-sofia-sans-condensed',
// 	subsets: ['latin', 'cyrillic'],
// })

// const sofiaSansSemi = Sofia_Sans_Semi_Condensed({
// 	variable: '--font-sofia-sans-semi-condensed',
// 	subsets: ['latin', 'cyrillic'],
// })

// const sofiaSansExtra = Sofia_Sans_Extra_Condensed({
// 	variable: '--font-sofia-sans-extra-condensed',
// 	subsets: ['latin', 'cyrillic'],
// })

// const sofiaSans = Sofia_Sans({
// 	variable: '--font-sofia-sans-condensed',
// 	subsets: ['latin', 'cyrillic'],
// })

// const yanoneKaffeesatz = Yanone_Kaffeesatz({
// 	variable: '--font-yanone-kaffeesatz',
// 	subsets: [
// 		'latin',
// 		'cyrillic',
// 		'cyrillic-ext',
// 		'latin-ext',
// 		'symbols',
// 		'vietnamese',
// 	],
// })

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${inter.variable} font-sans antialiased`}>
				<Providers
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange
				>
					{/* <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
						<Sidebar user={{ username, email, avatar: avatarUrl || '' }} />
						
							<MobileNav /> */}

					{children}

					{/* </div> */}
				</Providers>
			</body>
		</html>
	)
}
