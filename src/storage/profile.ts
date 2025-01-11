import { BACKEND_URL } from '@/lib/constants'
import { create } from 'zustand'
import { UserProfile, UserProfileStore } from '../lib/types'

const useProfileStore = create<UserProfileStore>(set => ({
	profile: null,
	loading: false,

	fetchProfile: async (id: string) => {
		set({ loading: true })
		try {
			const response = await fetch(`${BACKEND_URL}/profile/${id}`)
			const data: UserProfile = await response.json()
			set({ profile: data, loading: false })
		} catch (error) {
			console.error('Failed to fetch profile:', error)
			set({ loading: false })
		}
	},

	updateProfile: async (id: string, data: Partial<UserProfile>) => {
		set({ loading: true })
		try {
			const response = await fetch(`${BACKEND_URL}/profile/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})
			const updatedProfile: UserProfile = await response.json()
			set({ profile: updatedProfile, loading: false })
		} catch (error) {
			console.error('Failed to update profile:', error)
			set({ loading: false })
		}
	},

	deleteProfile: async (id: string) => {
		set({ loading: true })
		try {
			await fetch(`${BACKEND_URL}/profile/${id}`, {
				method: 'DELETE',
			})
			set({ profile: null, loading: false })
		} catch (error) {
			console.error('Failed to delete profile:', error)
			set({ loading: false })
		}
	},

	setProfile: (profile: UserProfile) => set({ profile }),
}))

export default useProfileStore
