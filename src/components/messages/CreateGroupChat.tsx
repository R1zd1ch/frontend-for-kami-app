import { UserProfile } from '@/lib/types'
import { useChatStore } from '@/storage/chatStore'
import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Checkbox } from '../ui/checkbox'

export function CreateGroupChat({
	users,
	senderId,
}: {
	users: UserProfile[]
	senderId: string
}) {
	const [selectedUsers, setSelectedUsers] = useState<string[]>([])
	const [chatName, setChatName] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const { createGroupChat } = useChatStore()

	const handleCreateGroupChat = async () => {
		try {
			if (!selectedUsers.length) {
				return
			}
			await createGroupChat(senderId, chatName, selectedUsers)
			setIsOpen(false)
			setSelectedUsers([])
			setChatName('')
		} catch (error) {
			console.error('Error creating group chat:', error)
			throw new Error(`Error creating group chat: ${error}`)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className='flex-1'>Беседа</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Создать беседу</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					<Input
						placeholder='Название беседы'
						value={chatName}
						onChange={e => setChatName(e.target.value)}
					/>
					<div className='max-h-60 overflow-y-auto'>
						{users.map(user => (
							<div
								key={user.id}
								className='flex items-center flex-wrap gap-2 p-2 hover:bg-muted rounded cursor-pointer'
								onClick={() =>
									setSelectedUsers(prev => {
										if (prev.includes(user.id)) {
											return prev.filter(id => id !== user.id)
										} else {
											return [...prev, user.id]
										}
									})
								}
							>
								<Checkbox checked={selectedUsers.includes(user.id)} />
								<div className='flex flex-row gap-2'>
									<span>@{user.username}</span>
									{user.firstName && user.lastName && (
										<span>
											({user.firstName} {user.lastName})
										</span>
									)}
								</div>
							</div>
						))}
					</div>
					<Button
						onClick={handleCreateGroupChat}
						disabled={!selectedUsers.length}
					>
						Создать беседу
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
