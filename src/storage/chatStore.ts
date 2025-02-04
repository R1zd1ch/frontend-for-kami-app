import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'
import { Message, Chat } from '@/lib/types'
import { getMessages } from '@/api/chat'
import { toast } from 'sonner'

interface ChatState {
	socket: Socket | null
	chats: Chat[]
	selectedChat: Chat | null
	messages: Message[]

	pagination: {
		currentPage: number
		totalPages: number
		isLoading: boolean
	}
	setChats: (chats: Chat[]) => void
	setMessages: (messages: Message[]) => void
	addMessage: (message: Message) => void
	addToGroup: (
		chatId: string,
		userIds: string[],
		userId: string
	) => Promise<void>
	createPrivateChat: (userId1: string, userId2: string) => Promise<void>
	createGroupChat: (
		userId: string,
		chatName: string,
		userIds: string[]
	) => Promise<void>
	initializeSocket: (userId: string) => void
	joinChatRooms: (chats: Chat[]) => void
	setSelectedChat: (chat: Chat | null) => void
	sendMessage: (content: string, userId: string) => Promise<void>
	loadMessages: (
		chatId: string,
		userId: string,
		loadMore?: boolean
	) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
	socket: null,
	chats: [],
	messages: [],
	selectedChat: null,
	pagination: {
		currentPage: 1,
		totalPages: 1,
		isLoading: false,
	},

	setChats: chats => set({ chats }),
	setMessages: messages => set({ messages }),
	setSelectedChat: chat => set({ selectedChat: chat }),
	sendMessage: async (content, userId) => {
		const { selectedChat, socket } = get()
		if (!selectedChat || !socket) return

		try {
			socket.emit('sendMessage', {
				chatId: selectedChat.id,
				content,
				userId,
			})
		} catch (error) {
			console.error('Ошибка отправки:', error)
		}
	},

	loadMessages: async (chatId, userId, loadMore = false) => {
		const { pagination, messages } = get()
		if (pagination.isLoading) return

		set({ pagination: { ...pagination, isLoading: true } })

		try {
			const page = loadMore ? pagination.currentPage + 1 : 1
			const response = await getMessages(chatId, userId, page)

			set({
				messages: loadMore
					? Array.from(
							new Map(
								[...response.data, ...messages].map(msg => [msg.id, msg])
							).values()
					  )
					: response.data,
				pagination: {
					currentPage: page,
					totalPages: response.meta.totalPages,
					isLoading: false,
				},
			})
		} catch (error) {
			set({ pagination: { ...pagination, isLoading: false } })
			console.log(error)
		}
	},

	addMessage: message => {
		const stateMessage = get().messages
		set({ messages: [...stateMessage, message] })
	},

	addToGroup: async (chatId, userIds, userId) => {
		const { socket } = get()
		if (!socket) return

		try {
			socket.emit('addToGroup', { chatId, userIds, userId })
		} catch (error) {
			console.error('Ошибка отправки:', error)
			throw error
		}
	},

	createPrivateChat: async (userId1, userId2) => {
		const { socket } = get()
		if (!socket) return

		try {
			socket.emit('createPrivateChat', { userId1, userId2 })
			console.log('Private chat created')
		} catch (error) {
			console.error('Ошибка отправки:', error)
			throw error
		}
	},

	createGroupChat: async (userId, chatName, userIds) => {
		const { socket } = get()
		if (!socket) return

		try {
			socket.emit('createGroupChat', { userId, chatName, userIds })
		} catch (error) {
			console.error('Ошибка создания беседы', error)
			throw error
		}
	},

	initializeSocket: userId => {
		const socket = io('http://localhost:3005', {
			extraHeaders: { userid: userId },
		})

		socket.on('connect', () => {
			console.log('Connected to WebSocket')
		})

		socket.on('newMessage', (message: Message) => {
			if (message.chatId === get().selectedChat?.id) {
				get().addMessage(message)
				console.log('New message received:', message)
			}
			if (
				message.senderId !== userId &&
				message.chatId !== get().selectedChat?.id
			) {
				toast(`Новое сообщение от ${message.sender.username}`, {
					description: message.content,
					action: {
						label: 'Открыть',
						onClick: () => {
							get().setSelectedChat({ id: message.chatId } as Chat)
							get().loadMessages(message.chatId, userId)
						},
					},
				})
			}

			set(state => ({
				chats: state.chats.map(c =>
					c.id === message.chatId ? { ...c, messages: [message] } : c
				),
			}))
		})

		socket.on('chatCreated', (newChat: Chat) => {
			set(state => ({
				chats: [...state.chats, newChat],
				selectedChat: state.selectedChat || newChat,
			}))
			get().joinChatRooms([newChat])
		})

		socket.on('addedToGroup', (chat: Chat) => {
			set(state => {
				const exists = state.chats.some(c => c.id === chat.id)
				if (!exists) {
					toast(`Вы добавлены в беседу ${chat.name}`)
				}
				return {
					chats: exists
						? state.chats.map(c => (c.id === chat.id ? chat : c))
						: [...state.chats, chat],
					selectedChat:
						state.selectedChat?.id === chat.id ? chat : state.selectedChat,
				}
			})
		})

		socket.on('groupUpdated', (updatedChat: Chat) => {
			set(state => ({
				chats: state.chats.map(c =>
					c.id === updatedChat.id ? updatedChat : c
				),
				selectedChat:
					state.selectedChat?.id === updatedChat.id
						? updatedChat
						: state.selectedChat,
			}))
		})

		set({ socket })
	},

	joinChatRooms: chats => {
		const socket = get().socket
		if (socket) {
			chats.forEach(chat => {
				socket.emit('join', `chat-${chat.id}`)
			})
		}
	},
}))
