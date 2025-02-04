'use client'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { ChevronFirst, ChevronLast, Plus, User, Users } from 'lucide-react'
import { useState, createContext, useContext, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useChatStore } from '@/storage/chatStore'
import { Chat, Message, UserProfile } from '@/lib/types'
import { format } from 'date-fns'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import CreatePrivateChat from './CreatePrivateChat'
import { getAllUsers } from '@/api/fetchprofile'
import { CreateGroupChat } from './CreateGroupChat'

export const SidebarContext = createContext({ isExpanded: false })

export default function SidebarChats({ userId }: { userId: string }) {
	const [isExpanded, setIsExpanded] = useState(true)
	const [selectedTab, setSelectedTab] = useState('private')
	const { chats, setSelectedChat, selectedChat } = useChatStore()
	const [users, setUsers] = useState<UserProfile[]>([])

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await getAllUsers()
				setUsers(response)
			} catch (error) {
				throw new Error(`Failed to fetch users ${error}`)
			}
		}

		fetchUsers()
	}, [])

	const pathname = usePathname()
	const chatIdPath = pathname.split('/')[3]

	const handleSelect = (chat: Chat) => {
		setSelectedChat(chat)
	}

	// console.log(userId)

	return (
		<Card
			className={`h-[95hv] transition-all rounded-3xl duration-300 border-r bg-card shadow-md ${
				isExpanded ? 'w-64' : 'w-fit'
			}`}
		>
			<nav className='h-full flex flex-col'>
				<div
					className={`p-4 pb-2 flex  items-center border-b ${
						isExpanded ? 'justify-between' : 'justify-center'
					}`}
				>
					<h2
						className={`text-lg font-semibold transition-all duration-300 ${
							isExpanded ? 'scale-100 w-32' : 'scale-0 w-0'
						}`}
					>
						Чаты
					</h2>
					<Button
						size='icon'
						variant='ghost'
						onClick={() => setIsExpanded(!isExpanded)}
						className='rounded-full hover:bg-muted'
					>
						{isExpanded ? (
							<ChevronFirst size={20} />
						) : (
							<ChevronLast size={20} />
						)}
					</Button>
				</div>
				<div className='flex flex-col justify-between h-full'>
					<SidebarContext.Provider value={{ isExpanded }}>
						<Tabs
							defaultValue={selectedTab}
							className={` bg-inherit ${isExpanded ? 'w-full' : 'w-full'}`}
							onValueChange={setSelectedTab}
						>
							<TabsList
								className={`flex flex-row items-center justify-center rounded-t-none  gap-2 ${
									isExpanded ? 'w-full' : 'w-full'
								}`}
							>
								{isExpanded ? (
									<>
										<TabsTrigger value='private' className='flex-1'>
											Личные
										</TabsTrigger>
										<TabsTrigger value='group' className='flex-1'>
											Беседы
										</TabsTrigger>
									</>
								) : (
									<div className=''>
										{selectedTab === 'private' ? (
											<User></User>
										) : (
											<Users></Users>
										)}
									</div>
								)}
							</TabsList>
							<TabsContent
								value='private'
								className='space-y-1 px-1 max-h-[74vh] overflow-y-auto'
							>
								{chats
									.filter(chat => chat.type === 'private')
									.map(chat => (
										<div key={chat.id} onClick={() => handleSelect(chat)}>
											<SidebarItemPrivate
												key={chat.id}
												id={chat.id}
												username={chat.participants[1].user.username}
												firstName={chat.participants[1].user.firstName}
												lastName={chat.participants[1].user.lastName}
												avatarUrl={
													chat.participants[1].user.avatarUrl as string
												}
												messages={chat.messages}
												active={
													selectedChat?.id === chat.id || chatIdPath === chat.id
												}
											></SidebarItemPrivate>
										</div>
									))}
							</TabsContent>
							<TabsContent
								value='group'
								className='space-y-1 px-1 max-h-[74vh] overflow-y-auto'
							>
								{chats
									.filter(chat => chat.type === 'group')
									.map(chat => (
										<div key={chat.id} onClick={() => handleSelect(chat)}>
											<SidebarItemGroup
												key={chat.id}
												id={chat.id}
												name={chat.name as string}
												messages={chat.messages}
												active={
													selectedChat?.id === chat.id || chatIdPath === chat.id
												}
											></SidebarItemGroup>
										</div>
									))}
							</TabsContent>
						</Tabs>
					</SidebarContext.Provider>
					<div className='transition-all duration-300'>
						{isExpanded && (
							<div className='flex flex-col w-full bg-muted rounded-3xl border-2 p-2 py-4'>
								<div className='pb-2 font-bold'>Создать чат:</div>
								<div className='flex-row flex w-full justify-between gap-4'>
									<CreatePrivateChat
										senderId={userId}
										users={users}
									></CreatePrivateChat>
									<CreateGroupChat
										users={users}
										senderId={userId}
									></CreateGroupChat>
								</div>
							</div>
						)}
						{!isExpanded && (
							<div className='flex flex-col w-full bg-muted rounded-3xl border-2 p-2 py-4'>
								<div className='flex-row flex w-full items-center justify-center'>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button className='rounded-xl'>
												<Plus className=' h-4 w-4' />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent
											align='end'
											side='right'
											sideOffset={8}
										>
											<DropdownMenuLabel>Новый чат</DropdownMenuLabel>
											<DropdownMenuSeparator></DropdownMenuSeparator>
											<DropdownMenuItem>
												<div className='flex items-center gap-2'>
													<User></User> <p>Личный</p>
												</div>
											</DropdownMenuItem>
											<DropdownMenuItem>
												<div className='flex items-center gap-2'>
													<Users></Users> <p>Беседа</p>
												</div>
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						)}
					</div>
				</div>
			</nav>
		</Card>
	)
}

export function SidebarItemPrivate({
	username,
	firstName = '',
	lastName = '',
	avatarUrl = '',
	active = false,
	id,
	messages,
}: {
	firstName?: string
	lastName?: string
	username: string
	avatarUrl?: string
	active?: boolean
	id: string
	messages: Message[]
}) {
	const { isExpanded } = useContext(SidebarContext)

	return (
		<Link href={`/main/messages/${id}`}>
			<div
				className={`flex flex-col p-1 rounded-xl border-2 transition-all duration-150 cursor-pointer hover:bg-primary/90 gap-1  ${
					active ? 'bg-primary' : 'bg-muted'
				}`}
			>
				<div className={`flex items-center justify-center gap-2 `}>
					<Avatar className='rounded-lg'>
						<AvatarImage src={avatarUrl} className='rounded-none'></AvatarImage>
						<AvatarFallback className='rounded-none'>
							{firstName && lastName
								? `${firstName} ${lastName}`.slice(0, 2).toUpperCase()
								: username.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<p
						className={` text-md font-semibold transition-all ${
							isExpanded ? 'scale-100 w-full' : 'scale-0 w-0 hidden'
						}`}
					>
						{firstName && lastName
							? `${firstName} ${lastName}`
							: `@${username}`}
					</p>
				</div>
				{messages.length > 0 && (
					<div
						className={`flex flex-col gap-1 text-xs p-1 w-full bg-secondary rounded-md ${
							isExpanded ? '' : 'items-center justify-center'
						}`}
					>
						<p
							className={`line-clamp-1 w-full ${
								isExpanded ? '' : 'text-center'
							}`}
						>
							{isExpanded ? messages[0].content : '...'}
						</p>
						<div className='flex flex-row justify-between text-muted-foreground'>
							{isExpanded && (
								<p>{format(new Date(messages[0].createdAt), 'dd.MM.yyyy')}</p>
							)}
							<p>{format(new Date(messages[0].createdAt), 'HH:mm')}</p>
						</div>
					</div>
				)}
			</div>
		</Link>
	)
}

export function SidebarItemGroup({
	name = 'GR',
	active = false,
	id,
	messages,
}: {
	name?: string
	active?: boolean
	id: string
	messages: Message[]
}) {
	const { isExpanded } = useContext(SidebarContext)
	// console.log(messages)

	return (
		<Link href={`/main/messages/${id}`}>
			<div
				className={`flex flex-col p-1 rounded-xl border-2 transition-all duration-150 cursor-pointer hover:bg-primary/90 gap-1  ${
					active ? 'bg-primary' : 'bg-muted'
				}`}
			>
				<div className={`flex items-center justify-center gap-2 `}>
					<Avatar className='rounded-lg'>
						<AvatarImage src={''} className='rounded-none'></AvatarImage>
						<AvatarFallback className='rounded-none'>
							{name.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<p
						className={` text-md font-semibold transition-all ${
							isExpanded ? 'scale-100 w-full' : 'scale-0 w-0 hidden'
						}`}
					>
						{name}
					</p>
				</div>
				{messages.length > 0 && (
					<div
						className={`flex flex-col gap-1 text-xs p-1 w-full bg-secondary rounded-md ${
							isExpanded ? '' : 'items-center justify-center'
						}`}
					>
						<div
							className={`line-clamp-1 w-full ${
								isExpanded ? '' : 'text-center'
							}`}
						>
							{isExpanded ? (
								<div className='flex flex-row gap-1'>
									<p className='font-bold'>{messages[0].sender.username}:</p>
									<p className='line-clamp-1'>{messages[0].content}</p>
								</div>
							) : (
								'...'
							)}
						</div>
						<div className='flex flex-row justify-between text-muted-foreground'>
							{isExpanded && (
								<p>{format(new Date(messages[0].createdAt), 'dd.MM.yyyy')}</p>
							)}
							<p>{format(new Date(messages[0].createdAt), 'HH:mm')}</p>
						</div>
					</div>
				)}
			</div>
		</Link>
	)
}
