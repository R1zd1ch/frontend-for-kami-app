'use client'
import { create } from 'zustand'
import { CategoriesGift, Gift, GiftAnalytics, UpdateGift } from '../lib/types'
import {
	getGifts,
	createGift as apiCreateGift,
	updateGift as apiUpdateGift,
	deleteGift as apiDeleteGift,
	getCategories,
	getAnalytics,
} from '../api/gifts'
import { v4 as uuid } from 'uuid'

type GiftStoreState = {
	gifts: Gift[]
	categories: CategoriesGift | null
	analytics: GiftAnalytics | null
	loading: boolean
	error: string | null
}

type GiftStoreActions = {
	fetchGifts: (userId: string) => Promise<void>
	fetchCategories: (userId: string) => Promise<void>
	fetchAnalytics: (userId: string) => Promise<void>
	createGift: (
		userId: string,
		gift: Omit<Gift, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
	) => Promise<Gift>
	updateGift: (
		userId: string,
		giftId: string,
		gift: UpdateGift
	) => Promise<Gift>
	deleteGift: (userId: string, giftId: string) => Promise<void>
}

export const useGiftStore = create<GiftStoreState & GiftStoreActions>(
	(set, get) => ({
		gifts: [],
		analytics: null,
		categories: null,
		loading: false,
		error: null,

		fetchCategories: async userId => {
			set({ loading: true, error: null })
			try {
				const categories = await getCategories(userId)
				set({ categories, loading: false })
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Unknown error'
				set({ error: message, loading: false })
				throw error
			}
		},

		fetchAnalytics: async userId => {
			set({ loading: true, error: null })
			try {
				const analytics = await getAnalytics(userId)
				set({ analytics, loading: false })
			} catch (error) {
				const message = error instanceof Error ? error.message : 'Unknown error'
				set({ error: message, loading: false })
				throw error
			}
		},

		fetchGifts: async userId => {
			set({ loading: true, error: null }) // Исправлено: добавлен сброс состояния
			try {
				const gifts = await getGifts(userId)
				set({ gifts, loading: false })
			} catch (error) {
				if ((error as Error).name !== 'AbortError') {
					set({
						error:
							error instanceof Error ? error.message : 'Failed to fetch gifts',
						loading: false,
					})
				}
			}
		},

		createGift: async (userId, newGift) => {
			const tempId = `temp-${uuid()}`
			const tempGift: Gift = {
				...newGift,
				id: tempId,
				userId,
				createdAt: new Date(),
			} as Gift

			set(state => ({
				gifts: [...state.gifts, tempGift],
				loading: true,
				error: null,
			}))

			console.log(tempGift)

			try {
				const createdGift = await apiCreateGift(userId, newGift as Gift)
				console.log(createdGift)
				set(state => ({
					gifts: state.gifts.map(gift =>
						gift.id === tempId ? createdGift : gift
					),
					loading: false,
				}))
				return createdGift
			} catch (error) {
				set(state => ({
					gifts: state.gifts.filter(gift => gift.id !== tempId),
					loading: false,
				}))
				const message = error instanceof Error ? error.message : 'Unknown error'
				set({ error: message })
				throw error
			}
		},

		updateGift: async (userId, giftId, updates) => {
			const originalGifts = get().gifts
			console.log(updates)

			set(state => ({
				gifts: state.gifts.map(gift =>
					gift.id === giftId ? { ...gift, ...updates } : gift
				),

				error: null,
			}))

			try {
				const updatedGift = await apiUpdateGift(userId, giftId, {
					description: updates.description,
					category: updates.category,
					received: updates.received,
					isCompleted: updates.isCompleted,
					priority: updates.priority,
					link: updates.link,
					image: updates.image,
					price: updates.price,
				})
				console.log(updatedGift)
				return updatedGift
			} catch (error) {
				set({ gifts: originalGifts })
				const message = error instanceof Error ? error.message : 'Unknown error'
				set({ error: message })
				throw error
			}
		},

		deleteGift: async (userId, giftId) => {
			const originalGifts = get().gifts
			set(state => ({
				gifts: state.gifts.filter(gift => gift.id !== giftId),
				loading: true,
				error: null,
			}))

			try {
				await apiDeleteGift(userId, giftId)
				set({ loading: false })
			} catch (error) {
				set({ gifts: originalGifts, loading: false })
				const message = error instanceof Error ? error.message : 'Unknown error'
				set({ error: message })
				throw error
			}
		},
	})
)
