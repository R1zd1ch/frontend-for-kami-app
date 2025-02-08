'use client'

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

import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { cn } from '@/lib/utils'

export default function CreatePrivateChat({
	users,
	senderId,
	isCollapsed = false,
}: {
	users: UserProfile[]
	senderId: string
	isCollapsed?: boolean
}) {
	const [selectedUser, setSelectedUser] = useState<string | null>(null)
	const [isOpen, setIsOpen] = useState(false)
	const { createPrivateChat } = useChatStore()

	const handleCreatePrivateChat = async () => {
		console.log(selectedUser)
		try {
			if (!selectedUser) {
				return
			}
			await createPrivateChat(senderId, selectedUser)
			setIsOpen(false)
			setSelectedUser(null)
		} catch (error) {
			console.error('Error creating private chat:', error)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				{isCollapsed ? (
					<Button className='w-full h-full py-2 my-0' variant={'secondary'}>
						Беседа
					</Button>
				) : (
					<Button className='flex-1'>Личный</Button>
				)}
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Выберите пользователя</DialogTitle>
				</DialogHeader>

				<RadioGroup
					value={selectedUser || ''}
					onValueChange={setSelectedUser}
					className='space-y-2'
				>
					<div className='max-h-60 overflow-y-auto'>
						{users.map(user => (
							<Label
								key={user.id}
								htmlFor={user.id}
								className={cn(
									'flex items-center gap-3 p-3 rounded-lg cursor-pointer',
									'hover:bg-muted/50 transition-colors'
								)}
							>
								<RadioGroupItem
									value={user.id}
									id={user.id}
									className='peer sr-only'
								/>
								<div className='w-4 h-4 border rounded-full border-primary flex items-center justify-center peer-data-[state=checked]:bg-primary'>
									<div className='w-2 h-2 bg-background rounded-full' />
								</div>
								<div className='flex flex-col'>
									<span className='font-medium'>@{user.username}</span>
									{user.firstName && user.lastName && (
										<span className='text-sm text-muted-foreground'>
											{user.firstName} {user.lastName}
										</span>
									)}
								</div>
							</Label>
						))}
					</div>

					<Button
						onClick={() => handleCreatePrivateChat()}
						disabled={!selectedUser}
					>
						Создать
					</Button>
				</RadioGroup>
			</DialogContent>
		</Dialog>
	)
}
