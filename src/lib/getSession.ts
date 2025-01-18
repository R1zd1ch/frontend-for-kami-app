import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const getSession = async () => {
	const cookiesStore = await cookies()
	const accessToken = cookiesStore.get('accessToken')?.value

	if (!accessToken) {
		return null
	}

	try {
		const decodedToken = jwt.decode(accessToken)

		if (typeof decodedToken === 'object' && decodedToken) {
			return decodedToken
		}
	} catch (error) {
		console.error('InvalidToken', error)
		return null
	}
}

export default getSession
