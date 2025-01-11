import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'

const getSession = async () => {
	return await getServerSession(authOptions)
}

export default getSession
