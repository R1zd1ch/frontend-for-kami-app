// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from 'next-auth'

declare module 'next-auth' {
	interface Session {
		user: {
			id: string
			username: string
			email: string
			firstName: string
			lastName: string
			avatarUrl: string
		}
		tokens: {
			accessToken: string
			refreshToken: string
			expiresAt: string
			expiresIn: string
			exp: number
		}
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from 'next-auth/jwt'

declare module 'next-auth/jwt' {
	interface JWT {
		user: {
			id: string
			username: string
			email: string
			firstName: string
			lastName: string
			avatarUrl: string
		}
		tokens: {
			accessToken: string
			refreshToken: string
			expiresAt: string
			expiresIn: string
			exp: number
		}
	}
}
