import { useState } from 'react'
import { updateMood } from '@/api/mood'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatInTimeZone } from 'date-fns-tz'
import { ru } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import { Mood } from '@/lib/types'
import { Trash } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '../ui/button'

const getMoodEmoji = (moodLevel: number): string => {
	if (moodLevel <= 2) return '😢'
	if (moodLevel <= 4) return '😐'
	if (moodLevel <= 6) return '🙂'
	if (moodLevel <= 8) return '😊'
	return '😁'
}

const MoodCard = ({
	mood,
	refreshData,
	handleDelete,
}: {
	handleDelete: (id: string) => Promise<void>
	mood: Mood
	refreshData: () => Promise<void>
}) => {
	const { id, date, moodLevel, note, createdAt, userId } = mood

	const formattedDate = formatInTimeZone(
		new Date(date),
		'UTC',
		'd MMMM yyyy HH:mm',
		{
			locale: ru,
		}
	)
	const formattedCreatedAt = format(
		new Date(createdAt),

		'd MMMM yyyy HH:mm',
		{
			locale: ru,
		}
	)

	const [isEditingNote, setIsEditingNote] = useState(false)
	const [isEditingMood, setIsEditingMood] = useState(false)
	const [currentNote, setCurrentNote] = useState(note)
	const [currentMoodLevel, setCurrentMoodLevel] = useState(moodLevel)
	const [isDeleting, setIsDeleting] = useState(false)

	const handleUpdate = async () => {
		await updateMood(userId, id, {
			moodLevel: currentMoodLevel,
			note: currentNote,
			date,
		})
		await refreshData()
	}

	const handleNoteKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setIsEditingNote(false)
			handleUpdate()
		} else if (e.key === 'Escape') {
			setIsEditingNote(false)
			setCurrentNote(note) // Reset to original value
		}
	}

	const handleMoodDelete = async () => {
		setIsDeleting(true)
		try {
			await handleDelete(id)
		} finally {
			setIsDeleting(false)
		}
	}

	const handleMoodKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setIsEditingMood(false)
			handleUpdate()
		} else if (e.key === 'Escape') {
			setIsEditingMood(false)
			setCurrentMoodLevel(moodLevel) // Reset to original value
		}
	}

	return (
		<Card className='w-full max-w-md p-4'>
			<CardHeader className='p-0 pb-2 flex flex-row justify-between items-center'>
				<CardTitle className='flex justify-between items-center'>
					<span>{formattedDate}</span>
				</CardTitle>
				<div className='flex flex-row gap-2 items-center'>
					<Button
						size={'sm'}
						variant={'ghost'}
						onClick={handleMoodDelete}
						disabled={isDeleting}
					>
						<Trash
							className='cursor-pointer hover:text-destructive'
							style={{ width: '20px', height: '20px' }}
						></Trash>
					</Button>
				</div>
			</CardHeader>
			<CardContent className='p-0 flex flex-row justify-between'>
				<div>
					<div className='space-y-1'>
						<div className='flex items-center'>
							<p className='text-sm text-muted-foreground'>
								Уровень настроения:
							</p>
							{isEditingMood ? (
								<Input
									value={currentMoodLevel}
									onChange={e => setCurrentMoodLevel(Number(e.target.value))}
									onKeyDown={handleMoodKeyPress}
									className='ml-2 w-16'
									type='number'
									min={0}
									max={10}
								/>
							) : (
								<span
									className='ml-2 cursor-pointer'
									onClick={() => setIsEditingMood(true)}
								>
									{currentMoodLevel}/10
								</span>
							)}
						</div>
						<div className='flex items-start flex-row'>
							<p className='text-sm text-muted-foreground'>Комментарий:</p>
							{isEditingNote ? (
								<Input
									value={currentNote}
									onChange={e => setCurrentNote(e.target.value)}
									onKeyDown={handleNoteKeyPress}
									className='ml-2 w-full'
								/>
							) : (
								<div
									className='ml-2 cursor-pointer break-words hyphens-auto'
									onClick={() => setIsEditingNote(true)}
								>
									{currentNote || 'Нет комментария'}
								</div>
							)}
						</div>
						<p className='text-xs text-muted-foreground'>
							Создано: {formattedCreatedAt}
						</p>
					</div>
				</div>
				<span className='text-5xl mr-[5%]'>
					{getMoodEmoji(currentMoodLevel)}
				</span>
			</CardContent>
		</Card>
	)
}

export default MoodCard
