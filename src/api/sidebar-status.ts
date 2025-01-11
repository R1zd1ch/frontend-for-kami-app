import { BACKEND_URL } from '@/lib/constants'

export const getSidebarStatus = async (id: string, token: string) => {
	try {
		const response = await fetch(`${BACKEND_URL}/sidebar-state/${id}`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		if (!response.ok) {
			throw new Error('Failed to fetch sidebar status')
		}
		const data = response.json()
		return data
	} catch (error) {
		console.error('Failed to fetch sidebar status:', error)
	}
}
