import { NextResponse } from 'next/server'
import { encode, getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { BACKEND_URL } from './lib/constants'
import { jwtDecode } from 'jwt-decode'

const secret = process.env.NEXTAUTH_SECRET!
export const SESSION_COOKIE = 'next-auth.session-token'
export const SESSION_SECURE = process.env.NEXTAUTH_URL?.startsWith('https://')
export const SESSION_TIMEOUT = 60 * 60 * 24 * 28 // 28 day

export async function middleware(request: NextRequest) {
	// Извлекаем токен сессии
	const token = await getToken({ req: request, secret })
	const response = NextResponse.next()

	// return response

	// if (token) {
	// 	const currentAccessToken = token.tokens.accessToken
	// 	const currentRefreshToken = token.tokens.refreshToken

	// 	if (!currentAccessToken || !currentRefreshToken) {
	// 		return NextResponse.redirect(new URL('/', request.url))
	// 	}
	// 	console.log(token)
	// 	if (new Date().getTime() > token.tokens.exp * 1000) {
	// 		const refreshedToken = await refreshAccessToken(
	// 			currentAccessToken,
	// 			currentRefreshToken
	// 		)

	// 		if (!refreshedToken) {
	// 			return NextResponse.redirect(new URL('/', request.url))
	// 		}

	// 		encode({
	// 			secret,
	// 			token: { ...token, tokens: refreshedToken },
	// 			maxAge: SESSION_TIMEOUT,
	// 		})

	// 		cookiesStore.set('accessToken', refreshedToken.accessToken, {})
	// 		cookiesStore.set('refreshToken', refreshedToken.refreshToken, {})

	// 		response = updateCookie(refreshedToken, request, response)
	// 	}

	// 	return response
	// }

	// if (token) {
	// 	const currentAccessToken = token.tokens.accessToken
	// 	const currentRefreshToken = token.tokens.refreshToken

	// 	if (!currentAccessToken || !currentRefreshToken) {
	// 		return NextResponse.redirect(new URL('/', request.url))
	// 	}

	// 	if (new Date().getTime() > token.tokens.exp * 1000) {
	// 		const refreshedToken = await refreshAccessToken(
	// 			currentAccessToken,
	// 			currentRefreshToken
	// 		)

	// 		if (!refreshedToken) {
	// 			return NextResponse.redirect(new URL('/', request.url))
	// 		}

	// 		encode({
	// 			secret,
	// 			token: refreshedToken,
	// 			maxAge: SESSION_TIMEOUT,
	// 		})

	// 		response = updateCookie(refreshedToken, request, response)
	// 	}

	// 	return response
	// }

	if (!token) {
		// Если токен не найден, перенаправляем на страницу логина
		return NextResponse.redirect(new URL('/', request.url))
	}

	return response
}
export const config = {
	matcher: ['/main/:path*', '/profile/:path*'],
}

export function updateCookie(
	sessionToken: string | null,
	request: NextRequest,
	response: NextResponse
): NextResponse<unknown> {
	if (sessionToken) {
		request.cookies.set(SESSION_COOKIE, sessionToken)
		response = NextResponse.next({
			request: {
				headers: request.headers,
			},
		})
		response.cookies.set(SESSION_COOKIE, sessionToken, {
			httpOnly: true,
			maxAge: SESSION_TIMEOUT,
			secure: SESSION_SECURE,
		})
	}
	return response
}

export async function refreshAccessToken(
	accessToken: string,
	refreshToken: string
) {
	const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},

		body: JSON.stringify({ refreshToken: refreshToken }),
	})

	console.log({ refreshToken: refreshToken })

	if (!res.ok) {
		console.error(await res.text())
		throw new Error('Failed to refresh access token')
	}

	console.log('Refreshed')

	const data = await res.json()

	const exp = jwtDecode(data.accessToken).exp
	console.log(exp)

	console.log(data)
	return {
		...data,
		exp,
	}
}
