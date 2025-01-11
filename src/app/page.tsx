import WelcomePage from '@/components/welcome/WelcomePage'

import { getSession } from 'next-auth/react'

export default async function StartPage() {
	const session = await getSession()

	return (
		<div>
			<WelcomePage session={session || null}></WelcomePage>
		</div>
	)
}
