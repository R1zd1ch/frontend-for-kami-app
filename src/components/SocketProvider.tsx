'use client'
import { useConnectSocket } from '@/hooks/useConnectSocket'

const SocketProvider = ({
	userId,
	children,
}: {
	userId: string
	children: React.ReactNode
}) => {
	useConnectSocket(userId)
	return <>{children}</>
}

export default SocketProvider
