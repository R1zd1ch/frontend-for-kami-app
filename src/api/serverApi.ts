'use server'

import axios from 'axios'

import { BACKEND_URL } from '@/lib/constants'
import { getLatestAccessToken } from '@/lib/auth'

const serverApi = axios.create({
	baseURL: BACKEND_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	withCredentials: true,
})

// Request interceptor
serverApi.interceptors.request.use(async config => {
	'use server'
	const token = await getLatestAccessToken()

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Response interceptor
serverApi.interceptors.response.use(
	response => response,
	async error => {
		'use server'
		const originalRequest = error.config
		const maxRetries = 2
		const retryDelay = 500 // 1 second

		// Check if it's an unauthorized error and hasn't exceeded max retries
		if (
			error.response?.status === 401 &&
			(!originalRequest._retryCount || originalRequest._retryCount < maxRetries)
		) {
			originalRequest._retryCount = (originalRequest._retryCount || 0) + 1

			// Wait for the middleware to potentially refresh the token
			await delay(retryDelay)

			try {
				// Get the latest access token
				const latestAccessToken = await getLatestAccessToken()

				if (latestAccessToken) {
					// Update the Authorization header with the latest token
					originalRequest.headers.Authorization = `Bearer ${latestAccessToken}`
				}

				// Retry the request with the updated token
				return serverApi(originalRequest)
			} catch (retryError) {
				console.error(
					`Failed to retry request (attempt ${originalRequest._retryCount}):`,
					retryError
				)
			}
		}

		// If it's not a 401 error, max retries exceeded, or all retries failed, reject the promise
		return Promise.reject(error)
	}
)

export const uploadImageAction = async (formData: FormData) => {
	try {
		const token = await getLatestAccessToken()

		const response = await axios.post(
			`${BACKEND_URL}/upload-image/gifts`,
			formData,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		)

		return response.data
	} catch (error) {
		console.error('Upload failed:', error)
		throw new Error('Failed to upload image')
	}
}

export default serverApi
