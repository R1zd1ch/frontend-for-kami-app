'use server'
import WelcomePage from '@/components/welcome/WelcomePage'
import getSession from '@/lib/getSession'

// import axios from 'axios'
// export const dynamic = 'force-dynamic'

export default async function StartPage() {
	const session = await getSession()

	return (
		<div>
			<WelcomePage session={session || null}></WelcomePage>
		</div>
	)
}
