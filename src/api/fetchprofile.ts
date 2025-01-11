import { BACKEND_URL } from '@/lib/constants'
import { UserProfile } from '@/lib/types'

export async function fetchProfile(
	id: string,
	token: string
): Promise<UserProfile> {
	const response = await fetch(`${BACKEND_URL}/profile/${id}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to fetch profile')
	}
	const data = await response.json()
	return data
}
