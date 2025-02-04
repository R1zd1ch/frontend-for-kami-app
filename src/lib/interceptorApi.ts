'use server'
import axios from 'axios'
import { BACKEND_URL } from './constants'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'

const api = axios.create({
	baseURL: BACKEND_URL,
	headers: {
		'Content-Type': 'application/json',
	},
})

// Интерцептор для запросов
api.interceptors.request.use(async config => {
	const token = getCookie('accessToken')
	// console.log('token bebra', token)

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

// Интерцептор для ответов
api.interceptors.response.use(
	async response => {
		return response
	},

	async error => {
		const originalRequest = error.config

		const refreshToken = getCookie('refreshToken')

		if (
			error.response.status === 401 &&
			refreshToken &&
			!originalRequest._retry
		) {
			originalRequest._retry = true

			try {
				const response = await axios.post(`${BACKEND_URL}/auth/refresh`, {
					refreshToken,
				})

				const newAccessToken = response.data.accessToken
				const newRefreshToken = response.data.refreshToken

				if (newAccessToken && newRefreshToken) {
					setCookie('accessToken', newAccessToken)
					setCookie('refreshToken', newRefreshToken)
					originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

					return api(originalRequest)
				}
			} catch (error) {
				console.error('Failed to refresh access token')

				deleteCookie('accessToken')
				deleteCookie('refreshToken')

				return Promise.reject(error)
			}
		}

		return Promise.reject(error)
	}
)

export default api
