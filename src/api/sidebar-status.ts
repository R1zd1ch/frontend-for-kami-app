'use server'
import api from '@/lib/interceptorApi'

export const getSidebarStatus = async (id: string) => {
	try {
		const response = await api.get(`/sidebar-state/${id}`)
		return response.data
	} catch (error) {
		console.error('Failed to fetch sidebar status:', error)
		throw error
	}
}
