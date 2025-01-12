'use client'
import { SessionProvider } from 'next-auth/react'
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
			<SessionProvider refetchInterval={1}>
				<Toaster></Toaster>
				{children}
			</SessionProvider>
		</NextThemesProvider>
	)
}

export default Providers
