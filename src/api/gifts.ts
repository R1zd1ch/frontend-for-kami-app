'use server'
import serverApi from './serverApi'
import { CategoriesGift, Gift, GiftAnalytics, UpdateGift } from '@/lib/types'

export async function getGifts(userId: string): Promise<Gift[]> {
	try {
		const response = await serverApi.get(`/gifts/${userId}`)
		return response.data
	} catch (error) {
		console.error('Failed to fetch gifts:', error)
		throw new Error('Failed to fetch gifts')
	}
}

export async function getGift(userId: string, giftId: string): Promise<Gift> {
	try {
		const response = await serverApi.get(`/gifts/${userId}/${giftId}`)
		return response.data
	} catch (error) {
		console.error('Failed to fetch gift:', error)
		throw new Error('Failed to fetch gift')
	}
}

export async function updateGift(
	userId: string,
	giftId: string,
	gift: UpdateGift
): Promise<Gift> {
	try {
		const response = await serverApi.put(`/gifts/${userId}/${giftId}`, gift)
		return response.data
	} catch (error) {
		console.error('Failed to update gift:', error)
		throw new Error('Failed to update gift')
	}
}

export async function deleteGift(userId: string, giftId: string) {
	try {
		const response = await serverApi.delete(`/gifts/${userId}/${giftId}`)
		return response.data
	} catch (error) {
		console.error('Failed to delete gift:', error)
		throw new Error('Failed to delete gift')
	}
}

export async function createGift(
	userId: string,
	gift: Omit<Gift, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Gift> {
	try {
		const response = await serverApi.post(`/gifts/${userId}`, gift)
		return response.data
	} catch (error) {
		console.error('Failed to create gift:', error)
		throw new Error('Failed to create gift')
	}
}

export async function getCategories(userId: string): Promise<CategoriesGift> {
	try {
		const response = await serverApi.get(`/gifts/${userId}/categories`)
		return response.data
	} catch (error) {
		console.error('Failed to fetch categories:', error)
		throw new Error('Failed to fetch categories')
	}
}

export async function getAnalytics(userId: string): Promise<GiftAnalytics> {
	try {
		const response = await serverApi.get(`/gifts/${userId}/analytics`)
		return response.data
	} catch (error) {
		console.error('Failed to fetch analytics:', error)
		throw new Error('Failed to fetch analytics')
	}
}

export async function uploadGiftImage(file: File) {
	try {
		const formData = new FormData()
		formData.append('file', file)
		const response = await serverApi.put(`/upload-image`, formData)
		return response.data
	} catch (error) {
		console.error('Failed to upload gift image:', error)
		throw new Error('Failed to upload gift image')
	}
}
