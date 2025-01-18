import AppBar from '@/components/AppBar'
import { cookies } from 'next/headers'

export default async function Home() {
	console.log(
		'AAAA',
		await fetch(`${process.env.NEXTAUTH_URL}/api/set-tokens`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
			// Убедитесь, что это необходимо для вашего случая
			credentials: 'include',
		})
	)

	console.log('bbbb', (await cookies()).getAll())
	return (
		<div>
			<AppBar></AppBar>
		</div>
	)
}
