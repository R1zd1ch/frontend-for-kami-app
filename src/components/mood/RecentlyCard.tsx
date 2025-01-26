import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '../ui/card'
import { Mood } from '@/lib/types'

import { format } from 'date-fns'
import { formatInTimeZone } from 'date-fns-tz'
import { ru } from 'date-fns/locale'

const getMoodEmoji = (moodLevel: number): string => {
	if (moodLevel <= 2) return '😢'
	if (moodLevel <= 4) return '😐'
	if (moodLevel <= 6) return '🙂'
	if (moodLevel <= 8) return '😊'
	return '😁'
}

const RecentlyCard = ({
	mood,
	created = false,
	updated = false,
}: {
	mood: Mood
	created?: boolean
	updated?: boolean
}) => {
	const formattedDate = formatInTimeZone(
		new Date(mood.date),
		'UTC',
		'd MMMM yyyy HH:mm',
		{
			locale: ru,
		}
	)
	const formattedCreatedAt = format(
		new Date(mood.createdAt),
		'd MMMM yyyy HH:mm',
		{
			locale: ru,
		}
	)

	const formattedUpdatedAt = format(
		new Date(mood.updatedAt),
		'd MMMM yyyy HH:mm',
		{
			locale: ru,
		}
	)

	return (
		<Card className='p-2 m-0'>
			<CardHeader className='p-0 m-0'>
				<div className=' flex flex-row justify-between items-center'>
					<CardTitle className='p-0 m-0 text-lg'>{formattedDate}</CardTitle>
					<div className='flex flex-row gap-2'>
						<div className='text-lg m-0 p-0'>
							{getMoodEmoji(mood.moodLevel)}
						</div>
						<div className='text-lg m-0 p-0'>{mood.moodLevel}</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className='p-0'>
				<div className='flex flex-col justify-between items-start'>
					<div className='text-muted-foreground text-xs '>Комментарий:</div>
					{mood.note ? (
						<div className='text-muted-foreground text-sm break-words hyphens-auto'>
							{mood.note}
						</div>
					) : (
						<div className='text-muted-foreground text-xs'>Нет комментария</div>
					)}
				</div>
			</CardContent>
			<CardFooter className='p-0 flex flex-row justify-end'>
				<div className='text-xs'>
					{created && `Создано: ${formattedCreatedAt}`}
					{updated && `Обновлено: ${formattedUpdatedAt}`}
				</div>
			</CardFooter>
		</Card>
	)
}

export default RecentlyCard
