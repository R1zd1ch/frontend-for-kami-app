/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import axios from 'axios'
import { BACKEND_URL } from './constants'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
// import api from './interceptorApi'

export async function login(username: string, password: string) {
	'use server'
	const cookieStore = await cookies()
	const { data } = await axios.post(`${BACKEND_URL}/auth/login`, {
		username,
		password,
	})

	cookieStore.set('accessToken', data.tokens.accessToken, {})
	cookieStore.set('refreshToken', data.tokens.refreshToken, {})

	redirect('/main')
}

export async function refreshSession() {
	'use server'

	const cookiesStore = await cookies()
	const now = Date.now()
	const refreshTime = 10 * 1000 // Интервал перед истечением токена для его обновления
	const accessToken = cookiesStore.get('accessToken')?.value

	if (accessToken) {
		const decoded = jwt.decode(accessToken)
		if (decoded && typeof decoded === 'object' && decoded.exp) {
			const timeToExpire = decoded.exp * 1000 // exp хранится в секундах, переводим в миллисекунды
			if (now < timeToExpire - refreshTime) {
				console.log('Skipping token refresh - token is still valid')
				return {
					accessToken,
					refreshToken: cookiesStore.get('refreshToken')?.value,
				}
			}
		}
	}

	// Обновляем токены
	try {
		const refreshToken = cookiesStore.get('refreshToken')?.value

		if (!refreshToken) {
			throw new Error('Refresh token not found')
		}

		console.log('Refreshing tokens...')

		const { data } = await axios.post(`${BACKEND_URL}/auth/refresh`, {
			refreshToken,
		})

		// Сохраняем новые токены в cookies
		cookiesStore.set('accessToken', data.accessToken, {
			httpOnly: true,
			secure: true,
			path: '/',
		})
		cookiesStore.set('refreshToken', data.refreshToken, {
			httpOnly: true,
			secure: true,
			path: '/',
		})

		return data
	} catch (error) {
		console.error('Failed to refresh token:', error)

		// Логаут в случае ошибки обновления
		await logout()
		throw error
	}
}

export async function logout() {
	'use server'
	const cookieStore = await cookies()
	cookieStore.delete('accessToken')
	cookieStore.delete('refreshToken')
}

export async function getLatestAccessToken() {
	'use server'
	const cookieStore = await cookies()
	return cookieStore.get('accessToken')?.value
}
