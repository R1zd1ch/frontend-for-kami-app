import { toast } from 'sonner'
import { SOCKET_URL } from '@/lib/constants'
import io, { Socket } from 'socket.io-client'
import { UserProfile } from '@/lib/types'
export class SocketApi {
	static socket: null | Socket = null

	static createConnection(userId: string) {
		this.socket = io(`${SOCKET_URL}`, {
			query: { userId }, // Передача userId через query
		})

		this.socket.on('connect', () => {
			console.log('Connected')
		})

		this.socket.on('disconnect', () => {
			console.log('Disconnected')
		})

		this.socket.on(
			'notification',
			(data: { message: { message: string; user: UserProfile } }) => {
				console.log('Notification received:', data.message)
				console.log()
				toast('Notification', {
					description: data.message.message,
					action: {
						label: 'Undo',
						onClick: () => console.log('Undo clicked'),
					},
				})
			}
		)
	}

	static disconnect() {
		this.socket?.disconnect()
	}
}

export default SocketApi
