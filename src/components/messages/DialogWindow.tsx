'use client'
import { useChatStore } from '@/storage/chatStore'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Loader2, SendHorizonal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import MessageItem from './MessageItem'
import { useIntersectionObserver } from '@uidotdev/usehooks'
import AddToGroup from './AddToGroup'
import { UserProfile } from '@/lib/types'
import { getAllUsers } from '@/api/fetchprofile'

const MemoizedMessageItem = memo(MessageItem)

const DialogWindow = ({
	chatRoomId,
	userId,
}: {
	chatRoomId: string
	userId: string
}) => {
	const inputRef = useRef<HTMLInputElement>(null)
	const messagesEndRef = useRef<HTMLDivElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const isMounted = useRef(false)
	const {
		selectedChat,
		loadMessages,
		messages,
		sendMessage,
		pagination,
		setMessages,
		setSelectedChat,
		chats,
	} = useChatStore()
	const [users, setUsers] = useState<UserProfile[]>([])
	const [loading, setLoading] = useState(false)
	const [isNearBottom, setIsNearBottom] = useState(true)
	const [сounterNewMessagesByOther, setCounterNewMessagesByOther] = useState(0)

	const prevScrollHeight = useRef<number>(0)
	const router = useRouter()
	const [loaderRef, entry] = useIntersectionObserver({
		root: containerRef.current,
		threshold: 0,
	})

	const handleScroll = useCallback(() => {
		if (!containerRef.current) return

		const { scrollTop, scrollHeight, clientHeight } = containerRef.current
		const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)
		setIsNearBottom(distanceFromBottom < 50)
	}, [])

	useEffect(() => {
		const container = containerRef.current
		container?.addEventListener('scroll', handleScroll)
		return () => container?.removeEventListener('scroll', handleScroll)
	}, [handleScroll])

	useEffect(() => {
		if (!containerRef.current) return

		const wasNearBottom = isNearBottom
		const isNewMessage = messages.length > prevScrollHeight.current

		const lastMessage = messages[messages.length - 1]
		const isLastMessageByMe = lastMessage?.senderId === userId
		const isLastMessageByOther = lastMessage?.senderId !== userId

		if (isLastMessageByMe && isNewMessage) {
			messagesEndRef.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
			})
		}

		requestAnimationFrame(() => {
			if (!containerRef.current) return

			if (isNewMessage && wasNearBottom) {
				messagesEndRef.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'end',
				})
			}

			prevScrollHeight.current = messages.length
		})
	}, [messages.length, isNearBottom])

	const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
		requestAnimationFrame(() => {
			messagesEndRef.current?.scrollIntoView({ behavior })
		})
	}, [])

	useEffect(() => {
		const chat = chats.find(chat => chat.id === chatRoomId)
		if (chat) setSelectedChat(chat)
		if (!selectedChat) router.push('/main/messages')
	}, [selectedChat, chats, router, chatRoomId, setSelectedChat])

	useEffect(() => {
		const loadInitialMessages = async () => {
			setMessages([])
			try {
				setLoading(true)
				await loadMessages(chatRoomId, userId)
				scrollToBottom('auto')
			} catch (error) {
				console.error('Ошибка загрузки:', error)
			} finally {
				setLoading(false)
			}
		}

		if (chatRoomId && userId) loadInitialMessages()
	}, [chatRoomId, userId, loadMessages, setMessages, scrollToBottom])

	const handleLoadMore = useCallback(async () => {
		if (!containerRef.current || pagination.isLoading) return

		const scrollHeightBefore = containerRef.current.scrollHeight
		const scrollTopBefore = containerRef.current.scrollTop
		const offset = scrollHeightBefore - scrollTopBefore

		await loadMessages(chatRoomId, userId, true).finally(() => {
			requestAnimationFrame(() => {
				if (!containerRef.current) return
				const scrollHeightAfter = containerRef.current.scrollHeight
				containerRef.current.scrollTop = scrollHeightAfter - offset
			})
		})
	}, [chatRoomId, userId, loadMessages, pagination.isLoading])

	useEffect(() => {
		if (
			entry?.isIntersecting &&
			!pagination.isLoading &&
			pagination.currentPage < pagination.totalPages &&
			isMounted.current
		) {
			const timer = setTimeout(handleLoadMore, 300)
			return () => clearTimeout(timer)
		}
	}, [entry, pagination, handleLoadMore])

	const handleSend = async () => {
		const content = inputRef.current?.value?.trim()
		if (!content || !selectedChat) return

		const prevHeight = containerRef.current?.scrollHeight || 0
		await sendMessage(content, userId)
		if (inputRef.current) inputRef.current.value = ''

		requestAnimationFrame(() => {
			if (isNearBottom && containerRef.current) {
				containerRef.current.scrollTop = containerRef.current.scrollHeight
			}
		})
	}

	useEffect(() => {
		isMounted.current = true
		return () => {
			isMounted.current = false
		}
	}, [])

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await getAllUsers()
				setUsers(response)
			} catch (error) {
				console.error('Failed to fetch users:', error)
			}
		}
		fetchUsers()
	}, [])

	if (!selectedChat) {
		return (
			<Card className='flex-1 flex items-center justify-center rounded-3xl'>
				<Loader2 className='animate-spin w-10 h-10' />
			</Card>
		)
	}

	return (
		<Card className='flex-1 flex flex-col rounded-3xl overflow-hidden'>
			{/* Header */}
			<div className='flex items-center justify-between p-4 border-b bg-muted/50'>
				<div className='flex items-center'>
					<Avatar className='h-9 w-9'>
						<AvatarImage
							src={
								selectedChat.type === 'private'
									? selectedChat.participants[1].user.avatarUrl
									: ''
							}
						/>
						<AvatarFallback>
							{selectedChat.type === 'private'
								? selectedChat.participants[1].user.username[0].toUpperCase()
								: selectedChat.name?.[0].toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className='ml-4 flex flex-col gap-0'>
						<h2 className='text-lg font-semibold'>
							{selectedChat.type === 'private'
								? selectedChat.participants[1].user.username
								: selectedChat.name}
						</h2>
						<p className='text-xs text-muted-foreground'>
							{selectedChat.type === 'group' &&
								`${selectedChat.participants.length} участников`}
						</p>
					</div>
				</div>
				{selectedChat.type === 'group' && (
					<AddToGroup userId={userId} users={users} />
				)}
			</div>

			{/* Контейнер сообщений */}
			<div
				className='flex-1 px-4 bg-chat-background overflow-y-auto scroll-container'
				ref={containerRef}
			>
				{/* Индикатор загрузки */}
				{pagination.isLoading && (
					<div className='flex items-center justify-center py-4'>
						<Loader2 className='animate-spin w-10 h-10' />
					</div>
				)}

				{/* Триггер пагинации */}
				{pagination.currentPage < pagination.totalPages &&
					!pagination.isLoading && (
						<>
							<div ref={loaderRef} className='h-[0px] opacity-0' />
							<div className='flex items-center justify-center py-4 opacity-0'>
								<Loader2 className='animate-spin w-10 h-10' />
							</div>
						</>
					)}

				{/* Лист сообщений */}
				<div className='space-y-2 py-4 relative'>
					{messages.map(message => (
						<MemoizedMessageItem
							key={message.id}
							message={message}
							userId={userId}
						/>
					))}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Инпуты хуимпуты */}
			<div className='p-4 border-t bg-muted/50'>
				<div className='flex gap-4 items-center justify-center'>
					<Input
						ref={inputRef}
						placeholder='Напишите сообщение...'
						className='px-6 py-5 border-primary/20'
						onKeyDown={e => e.key === 'Enter' && handleSend()}
					/>
					<Button
						size='icon'
						className='rounded-full w-12 h-12'
						onClick={handleSend}
					>
						<SendHorizonal className='w-6 h-6' />
					</Button>
				</div>
			</div>
		</Card>
	)
}

export default DialogWindow
