import { Message } from '@/lib/types'
import { useChatStore } from '@/storage/chatStore'
import { format } from 'date-fns'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Check, CheckCheck } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface MessageItemProps {
	message: Message
	userId: string
	type: string
}

const MessageItem: React.FC<MessageItemProps> = ({ message, userId, type }) => {
	const { ref, inView } = useInView({
		threshold: 0.5,
		triggerOnce: true,
	})

	const { markMessagesAsSeen } = useChatStore()

	useEffect(() => {
		if (
			inView &&
			message.senderId !== userId &&
			!message.seenBy.some(user => user.id === userId)
		) {
			markMessagesAsSeen(message.chatId, userId, [message.id])
		}
	}, [
		inView,
		message.id,
		message.senderId,
		userId,
		message.chatId,
		markMessagesAsSeen,
		message.seenBy,
	])

	// Определяем, прочитано ли сообщение (есть записи в seenBy)
	const isSeen = message.seenBy && message.seenBy.length > 0

	return (
		<div
			ref={ref}
			data-message-id={message.id}
			className={`flex my-1 ${
				message.senderId === userId ? 'justify-end' : 'justify-start'
			}`}
		>
			<div
				className={`rounded-xl p-3 max-w-[75%] ${
					message.senderId === userId
						? 'bg-primary text-primary-foreground'
						: 'bg-muted'
				}`}
			>
				<div className='flex items-end gap-2'>
					<div className='w-fit max-w-[95%]'>
						{message.senderId !== userId ? (
							<p className='text-xs font-bold text-muted-foreground'>
								@{message.sender.username}
							</p>
						) : (
							<p className='text-xs font-bold text-muted-foreground'>Вы</p>
						)}
						<p className='text-sm break-words'>{message.content}</p>
					</div>
					<Tooltip delayDuration={300}>
						<TooltipTrigger asChild>
							<div className='flex flex-row items-end gap-1'>
								<p className='text-[10px] text-muted-foreground'>
									{format(new Date(message.createdAt), 'HH:mm')}
								</p>
								{message.senderId === userId && (
									<div className='mt-1'>
										{isSeen ? (
											<CheckCheck style={{ width: '12px', height: '12px' }} />
										) : (
											<Check style={{ width: '12px', height: '12px' }} />
										)}
									</div>
								)}
							</div>
						</TooltipTrigger>
						{isSeen && (
							<TooltipContent
								side={message.senderId === userId ? 'bottom' : 'right'}
								className={`border-primary-foreground ${
									message.senderId === userId
										? 'bg-primary text-primary-foreground mr-6'
										: 'bg-muted'
								}`}
							>
								{type === 'private' && isSeen && (
									<p className='text-xs'>
										Прочитано в{' '}
										{format(
											new Date(message.seenBy[0].seenAt || new Date()),
											'HH:mm dd.MM.yyyy'
										)}
									</p>
								)}
							</TooltipContent>
						)}
					</Tooltip>
				</div>
			</div>
		</div>
	)
}

export default MessageItem
