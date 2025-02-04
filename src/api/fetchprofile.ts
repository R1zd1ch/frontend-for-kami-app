'use server'
import { UserProfile } from '@/lib/types'
import serverApi from './serverApi'

export async function fetchProfile(id: string): Promise<UserProfile> {
	const response = await serverApi.get(`/profile/${id}`)
	console.log('fsdfsdfsdfs', response.data)
	return response.data
}

export async function getAllUsers(): Promise<UserProfile[]> {
	const response = await serverApi.get('profile/all-users')
	console.log('fsdfsdfsdfs', response.data)
	return response.data
}
