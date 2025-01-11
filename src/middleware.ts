import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

const secret = process.env.NEXTAUTH_SECRET

export async function middleware(request: NextRequest) {
	// Извлекаем токен сессии
	const token = await getToken({ req: request, secret })

	if (!token) {
		// Если токен не найден, перенаправляем на страницу логина
		return NextResponse.redirect(new URL('/', request.url))
	}

	// const expiresAt = new Date(token.tokens.expiresIn).getTime()
	// if (expiresAt !== 0 && new Date().getTime() > expiresAt) {
	// 	return NextResponse.redirect(new URL('/', request.url))
	// }

	const response = NextResponse.next()
	response.cookies.set('session', '', { maxAge: -1 })

	// Если токен валиден, продолжаем выполнение
	return response
}
export const config = {
	matcher: ['/main/:path*', '/profile/:path*'],
}
