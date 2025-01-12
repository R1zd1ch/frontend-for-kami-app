import { BACKEND_URL } from '@/lib/constants'
import { jwtDecode } from 'jwt-decode'
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
				const exp = jwtDecode(user.tokens.accessToken).exp

				return {
					...user,
					tokens: {
						...user.tokens,
						exp,
					},
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, account }) {
			if (account && user) {
				return { ...token, ...user }
			}
			console.log('revalidating')

			// Return previous token if the access token has not expired yet
			if (Date.now() < token.tokens.exp * 1000 - 10000) {
				return token
			}

			// Access token has expired, try to update it
			return refreshAccessToken(token)
		},
		async session({ session, token }) {
			session.user = token.user
			session.tokens = token.tokens
			return session
		},
	},
	pages: {
		signIn: '/auth/signin',
	},
	secret: process.env.NEXTAUTH_SECRET,
	session: {
		strategy: 'jwt',
	},
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
	const exp = jwtDecode(data.accessToken).exp
	console.log(data)
	return {
		...token,
		tokens: {
			...data,
			exp,
		},
	}
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
