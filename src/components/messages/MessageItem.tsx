import { Message } from '@/lib/types'
import { format } from 'date-fns'

const MessageItem = ({
	message,
	userId,
}: {
	message: Message
	userId: string
}) => {
	return (
		<div
			className={`flex ${
				message.senderId === userId ? 'justify-end' : 'justify-start'
			}`}
		>
			<div
				className={`max-w-[75%] rounded-xl p-3 ${
					message.senderId === userId
						? 'bg-primary text-primary-foreground'
						: 'bg-muted'
				}`}
			>
				<div className='flex items-end gap-2'>
					<div className=' w-fit max-w-[95%]'>
						{message.senderId !== userId && (
							<p className='text-xs font-bold text-muted-foreground'>
								@{message.sender.username}
							</p>
						)}
						{message.senderId === userId && (
							<p className='text-xs font-bold text-muted-foreground'>Вы</p>
						)}

						<p className='text-sm  break-words'>{message.content}</p>
					</div>
					<p
						className={`text-[10px] ${
							message.senderId === userId
								? 'text-primary-foreground/70'
								: 'text-muted-foreground'
						}`}
					>
						{format(new Date(message.createdAt), 'HH:mm')}
					</p>
				</div>
			</div>
		</div>
	)
}

export default MessageItem
