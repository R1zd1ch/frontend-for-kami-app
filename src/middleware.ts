import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

import { refreshSession } from './lib/auth'
import { cookies } from 'next/headers'

export async function middleware(req: NextRequest) {
	const cookiesStore = await cookies()
	const accessToken = req.cookies.get('accessToken')?.value
	// console.log('accessToken', accessToken)

	if (accessToken) {
		const decoded = jwt.decode(accessToken)
		// console.log('decoded', decoded)
		if (decoded && typeof decoded === 'object') {
			const now = Math.floor(Date.now() / 1000)
			// console.log('now', now)
			// console.log('exp', decoded.exp)

			//если токен истекает через время какое-то то
			if (decoded.exp && decoded.exp - 15 * 60 < now) {
				const refreshToken = req.cookies.get('refreshToken')?.value
				// console.log('refreshedTokenMiddleWare', refreshToken)

				if (refreshToken) {
					try {
						const response = await refreshSession()
						if (response.ok) {
							const data = await response.json()
							const res = NextResponse.next()
							req.cookies.set('accessToken', data.tokens.accessToken)
							req.cookies.set('refreshToken', data.tokens.refreshToken)
							cookiesStore.set('accessToken', data.tokens.accessToken)
							cookiesStore.set('refreshToken', data.tokens.refreshToken)
							return res
						}
					} catch (error) {
						console.error(error)
						return NextResponse.redirect(new URL('/auth/signin', req.url))
					}
				}
			}
		}
	}

	if (!accessToken) {
		req.cookies.delete('accessToken')
		req.cookies.delete('refreshToken')
		return NextResponse.redirect(new URL('/auth/signin', req.url))
	}
	return NextResponse.next()
}

export const config = {
	matcher: ['/main/:path*', '/main/:path*/:path*'],
}
