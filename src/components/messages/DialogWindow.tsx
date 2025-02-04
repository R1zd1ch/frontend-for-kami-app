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
	const router = useRouter()

	const [loaderRef, entry] = useIntersectionObserver({
		root: containerRef.current,
		threshold: 0,
	})

	const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
		requestAnimationFrame(() => {
			messagesEndRef.current?.scrollIntoView({ behavior })
		})
	}

	useEffect(() => {
		const chat = chats.find(chat => chat.id === chatRoomId)
		if (chat) {
			setSelectedChat(chat)
		}
		if (!selectedChat) {
			router.push('/main/messages')
		}
	}, [selectedChat, chats, router, chatRoomId, setSelectedChat])

	useEffect(() => {
		console.log(messages)
	}, [messages])

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
	}, [chatRoomId, userId, loadMessages, setMessages])

	useEffect(() => {
		requestAnimationFrame(() => {
			if (containerRef.current && messagesEndRef.current) {
				messagesEndRef.current.scrollIntoView()
			}
		})
	}, [selectedChat])

	const handleLoadMore = useCallback(async () => {
		if (!containerRef.current || pagination.isLoading) return

		const scrollHeightBefore = containerRef.current.scrollHeight
		const scrollTopBefore = containerRef.current.scrollTop
		const offset = scrollHeightBefore - scrollTopBefore

		// console.log(scrollHeightBefore, scrollTopBefore)

		await loadMessages(chatRoomId, userId, true).finally(() => {
			requestAnimationFrame(() => {
				if (!containerRef.current) return
				const scrollHeightAfter = containerRef.current.scrollHeight
				// console.log(scrollHeightAfter)
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
			const handle = setTimeout(() => {
				handleLoadMore()
			}, 300)

			return () => clearTimeout(handle)
		}
	}, [entry, pagination])

	const handleSend = async () => {
		const content = inputRef.current?.value
		if (content && inputRef.current && !content.trim()) {
			inputRef.current.value = ''
			return
		}
		if (!content || !selectedChat) return

		await sendMessage(content, userId).finally(() => {})

		if (inputRef.current) inputRef.current.value = ''
	}

	useEffect(() => {
		if (!messages.length) return
		const myMessage = messages[messages.length - 1].senderId === userId
		if (myMessage) {
			scrollToBottom()
		}
	}, [messages, userId])

	// useEffect(() => {
	// 	if (!selectedChat) {
	// 		router.push('/main/messages')
	// 	}
	// }, [selectedChat, router])

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
				console.log(error)
				throw new Error(`Failed to fetch users ${error}`)
			}
		}

		fetchUsers()
	}, [])

	useEffect(() => {
		if (selectedChat) {
			const timer = setTimeout(() => scrollToBottom('auto'), 100)
			return () => clearTimeout(timer)
		}
	}, [selectedChat])

	if (!selectedChat)
		return (
			<Card className='flex-1 flex items-center justify-center  rounded-3xl'>
				<Loader2 className='animate-spin w-10 h-10'></Loader2>
			</Card>
		)

	return (
		<Card className='flex-1 flex flex-col rounded-3xl overflow-hidden'>
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
					<AddToGroup userId={userId} users={[...(users || [])]}></AddToGroup>
				)}
			</div>

			<div
				className='flex-1 px-4 bg-chat-background overflow-y-scroll scrollbar scrollbar-thumb-muted scrollbar-track-gray-200 realative [scrollbar-gutter:stable]'
				ref={containerRef}
			>
				{pagination.isLoading && (
					<div className='flex items-center justify-center py-4'>
						<Loader2 className='animate-spin w-10 h-10' />
					</div>
				)}

				{pagination.currentPage < pagination.totalPages &&
					!pagination.isLoading && (
						<div className='flex items-center justify-center py-4 opacity-0'>
							<Loader2 className='animate-spin w-10 h-10' />
						</div>
					)}

				<div className='space-y-2 py-4 relative'>
					<div ref={loaderRef} className='h-[300px] absolute top-0 w-full' />
					{messages.map(message => (
						<MemoizedMessageItem
							key={message.id}
							message={message}
							userId={userId}
						></MemoizedMessageItem>
					))}
					<div ref={messagesEndRef} className='  ' />
				</div>
			</div>

			<div className='p-4 border-t bg-muted/50'>
				<div className='flex gap-4 items-center justify-center'>
					<Input
						ref={inputRef}
						placeholder='Напишите сообщение...'
						className=' px-6 py-5 border-primary/20'
						onKeyDown={e => e.key === 'Enter' && handleSend()}
					/>
					<Button
						size='icon'
						className='rounded-full w-12 h-12'
						onClick={handleSend}
					>
						<SendHorizonal style={{ width: '24px', height: '24px' }} />
					</Button>
				</div>
			</div>
		</Card>
	)
}

export default DialogWindow
