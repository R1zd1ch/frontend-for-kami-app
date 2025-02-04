'use client'
import { useChatStore } from '@/storage/chatStore'
import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { UserProfile } from '@/lib/types'
import { Button } from '../ui/button'

export default function AddToGroup({
	userId,
	users,
}: {
	userId: string
	users: UserProfile[]
}) {
	const [selectedUsers, setSelectedUsers] = useState<string[]>([])
	const { addToGroup, selectedChat } = useChatStore()
	const [open, setOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		if (!selectedChat) return

		try {
			setLoading(true)
			await addToGroup(selectedChat.id, selectedUsers, userId)
			setOpen(false)
			setSelectedUsers([])
		} finally {
			setLoading(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant='default' disabled={!selectedChat}>
					Добавить в беседу
				</Button>
			</DialogTrigger>

			<DialogContent>
				<DialogHeader>
					<DialogTitle>Выберите участников</DialogTitle>
				</DialogHeader>

				<div className='space-y-4'>
					{users
						.filter(user => user.id !== userId)
						.map(user => (
							<label
								key={user.id}
								className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer'
							>
								<input
									type='checkbox'
									checked={selectedUsers.includes(user.id)}
									onChange={e =>
										setSelectedUsers(prev =>
											e.target.checked
												? [...prev, user.id]
												: prev.filter(id => id !== user.id)
										)
									}
									className='h-4 w-4 accent-primary'
								/>
								<span>
									{user.firstName && user.lastName
										? `${user.firstName} ${user.lastName}`
										: user.username}
								</span>
							</label>
						))}

					<Button
						onClick={handleSubmit}
						disabled={loading || selectedUsers.length === 0}
						className='w-full mt-4'
					>
						{loading ? 'Добавление...' : 'Добавить выбранных'}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
