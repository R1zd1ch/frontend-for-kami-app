// app/api/auth/tokens/route.js
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

// Установка токенов
export async function POST(request: NextRequest) {
	const { accessToken, refreshToken } = await request.json()

	if (accessToken) {
		;(await cookies()).set('accessToken', accessToken, {
			httpOnly: true,
			secure: true,
			path: '/',
			maxAge: 60 * 60 * 24, // 1 день
		})
	}

	if (refreshToken) {
		;(await cookies()).set('refreshToken', refreshToken, {
			httpOnly: true,
			secure: true,
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 7 дней
		})
	}

	return NextResponse.json({ message: 'Tokens set successfully' })
}

// Удаление токенов
export async function DELETE() {
	const cookieStore = await cookies()
	cookieStore.delete('accessToken')
	cookieStore.delete('refreshToken')
	return NextResponse.json({ message: 'Tokens cleared' })
}

// Получение токенов
export async function GET(request: NextRequest) {
	const cookieStore = await cookies()
	// console.log('from route', cookieStore.getAll(), request.cookies.getAll())
	const accessToken = cookieStore.get('accessToken')?.value
	const refreshToken = cookieStore.get('refreshToken')?.value

	return NextResponse.json({ accessToken, refreshToken })
}
