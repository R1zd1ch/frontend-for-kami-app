/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import jwt from 'jsonwebtoken'
import axios from 'axios'

export function useSession() {
	const [session, setSession] = useState<null | Record<string, any>>(null)

	useEffect(() => {
		const fetchSession = async () => {
			const cookies = await axios.get('api/auth/tokens')

			if (cookies.data.accessToken) {
				const decodedToken = jwt.decode(cookies.data.accessToken)
				setSession(decodedToken as Record<string, any>)
			}
		}

		fetchSession()
	}, [])
	return session
}
