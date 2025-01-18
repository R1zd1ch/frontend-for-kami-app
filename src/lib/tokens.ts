import { getCookie, setCookie, deleteCookie } from 'cookies-next/client'
import axios from 'axios'
import { BACKEND_URL } from './constants'

export function getClientTokens() {
	return {
		accessToken: getCookie('accessToken'),
		refreshToken: getCookie('refreshToken'),
	}
}

export function setClientTokens(accessToken: string, refreshToken: string) {
	setCookie('accessToken', accessToken)
	setCookie('refreshToken', refreshToken)
}

export function deleteClientTokens() {
	deleteCookie('accessToken')
	deleteCookie('refreshToken')
}

export const refreshAccessToken = async (
	refreshToken: string
): Promise<string | 'Token refresh failed'> => {
	try {
		// Используем axios для запроса обновления токена
		const response = await axios.post(`${BACKEND_URL}/auth/refresh`, {
			refreshToken: refreshToken,
		})

		const newAccessToken = response.data.accessToken

		if (!newAccessToken) {
			throw new Error('No access token received')
		}

		// Устанавливаем новый токен в cookies

		// Клиентская среда
		setCookie('accessToken', newAccessToken)

		return newAccessToken
	} catch (error) {
		console.error('Failed to refresh access token:', error)
		return 'Token refresh failed'
	}
}
