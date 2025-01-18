'use client'
import * as React from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { Toaster } from 'sonner'

//theme and session providers
const Providers = ({
	children,
	...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
	return (
		<NextThemesProvider {...props}>
			<Toaster></Toaster>
			{children}
		</NextThemesProvider>
	)
}

export default Providers
