import { UserProfile } from '@/lib/types'
import serverApi from './serverApi'

export async function fetchProfile(id: string): Promise<UserProfile> {
	const response = await serverApi.get(`/profile/${id}`)
	return response.data
}
