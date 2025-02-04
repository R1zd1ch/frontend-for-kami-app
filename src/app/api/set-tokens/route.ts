import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
	// Получаем cookies и устанавливаем новую cookie
	const response = NextResponse.json({ kami: 'bebra' })

	// Устанавливаем cookie в ответ
	response.cookies.set('kami', 'bebra', {
		sameSite: 'strict',
		path: '/',
		httpOnly: true, // Для безопасности: cookie не доступны через JS
		secure: false,
	})

	// console.log('Cookies set:', response.cookies.getAll())

	return response
}
