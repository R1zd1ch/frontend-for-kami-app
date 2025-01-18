'use server'

import { cookies } from 'next/headers'

export async function getCookies() {
	const cookiesStore = await cookies()
	return cookiesStore.getAll()
}

export async function create() {
	const cookiesStore = await cookies()
	cookiesStore.set('aaaa', '123')
	cookiesStore.set('bbbb', '123')

	return {
		aaaa: cookiesStore.get('aaaa')?.value,
		bbbb: cookiesStore.get('bbbb')?.value,
	}
}

export async function getToken() {
	const cookiesStore = await cookies()
	return cookiesStore.get('accessToken')
}
