import { BACKEND_URL } from '@/lib/constants'
import NextAuth, { NextAuthOptions } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: 'Credentials',
			credentials: {
				username: { label: 'Username', type: 'text', placeholder: 'jsmith' },
				password: { label: 'Password', type: 'password' },
			},
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			async authorize(credentials, req) {
				if (!credentials?.username || !credentials?.password) {
					return null
				}
				const { username, password } = credentials
				const res = await fetch(`${BACKEND_URL}/auth/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ username, password }),
				})
				if (res.status === 401) {
					console.log(res.statusText)
					return null
				}
				const user = await res.json()
				return user
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				console.log('New user logged in:', user)
				return { ...token, ...user }
			}

			console.log('Current time:', new Date().getTime())
			console.log(
				'Token expires at:',
				new Date(token.tokens.expiresAt).getTime()
			)

			const expiresAt = new Date(token.tokens.expiresIn).getTime()
			if (expiresAt !== 0 && new Date().getTime() < expiresAt) {
				console.log('Token is still valid.')
				return token
			}

			if (expiresAt === 0) return token

			// const newToken = await refreshAccessToken(token)

			return refreshAccessToken(token)
		},

		async session({ token, session }) {
			session.user = token.user
			session.tokens = token.tokens
			return session
		},
	},
	pages: {
		signIn: '/auth/signin',
	},
	secret: process.env.NEXTAUTH_SECRET,
}

async function refreshAccessToken(token: JWT) {
	const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token.tokens.accessToken}`,
		},

		body: JSON.stringify({ refreshToken: token.tokens.refreshToken }),
	})

	console.log({ refreshToken: token.tokens.refreshToken })

	if (!res.ok) {
		console.error(await res.text())
		throw new Error('Failed to refresh access token')
	}

	console.log('Refreshed')

	const data = await res.json()
	console.log(data)
	return {
		...token,
		tokens: {
			...data,
		},
	}
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
