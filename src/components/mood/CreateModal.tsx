'use client'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Slider } from '../ui/slider'

const getMoodEmoji = (moodLevel: number): string => {
	if (moodLevel <= 2) return '😢'
	if (moodLevel <= 4) return '😐'
	if (moodLevel <= 6) return '🙂'
	if (moodLevel <= 8) return '😊'
	return '😁'
}

export default function CreateMoodModal({
	handleCreateMood,
	isOpenCreateModal,
	setIsOpenCreateModal,
	selectedDay,
}: {
	selectedDay?: Date
	handleCreateMood: (
		moodLevel: number,
		note: string,
		date: string
	) => Promise<void>
	isOpenCreateModal: boolean
	setIsOpenCreateModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
	const [moodLevel, setMoodLevel] = useState(5)
	const [note, setNote] = useState('')
	const [date, setDate] = useState(
		selectedDay
			? new Date(selectedDay.setHours(5, 0, 0, 0)).toISOString()
			: new Date(new Date().setHours(5, 0, 0, 0)).toISOString()
	)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!selectedDay) return

		setDate(new Date(selectedDay).toISOString())
	}, [selectedDay])

	const handleMoodLevelChange = (value: number) => {
		setMoodLevel(value)
	}

	const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setNote(event.target.value)
	}

	const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setDate(event.target.value)
	}

	const handleSubmit = async () => {
		setLoading(true)
		// Преобразуем выбранное время в UTC
		const localDate = new Date(date)
		const utcDate = localDate.toISOString() // Преобразуем в формат ISO (UTC)

		// Отправляем данные на сервер с учетом UTC
		await handleCreateMood(moodLevel, note, utcDate)
		setLoading(false)
		setIsOpenCreateModal(false) // Закрываем модалку после отправки
	}

	// Обработчик для нажатия клавиши "Enter"
	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === 'Enter') {
			handleSubmit()
		}
	}

	return (
		<div onKeyDown={handleKeyDown}>
			<Dialog open={isOpenCreateModal} onOpenChange={setIsOpenCreateModal}>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Создать настроение</DialogTitle>
						<DialogDescription>Введите ваше настроение.</DialogDescription>
					</DialogHeader>

					{/* Селектор уровня настроения */}
					<div className='mb-4'>
						<Label className='block text-sm font-medium text-muted-foreground'>
							Уровень настроения:
						</Label>
						<Slider
							min={1}
							max={10}
							step={1}
							defaultValue={[moodLevel]}
							onValueChange={value => handleMoodLevelChange(value[0])}
							className='w-full cursor-pointer'
						/>
						<p className='text-center text-xl'>{getMoodEmoji(moodLevel)}</p>
					</div>

					{/* Поле для заметки */}
					<div className='mb-4'>
						<Label className='block text-sm font-medium text-muted-foreground'>
							Комментарий (опционально):
						</Label>
						<Input
							type='text'
							value={note}
							onChange={handleNoteChange}
							placeholder='Введите ваш комментарий'
						/>
					</div>

					{/* Поле для даты и времени (datetime-local) */}
					<div className='mb-4'>
						<Label className='block text-sm font-medium text-muted-foreground'>
							Дата и время:
						</Label>
						<Input
							type='datetime-local'
							value={date.slice(0, 16)} // Обновлено для корректного отображения времени
							onChange={handleDateChange}
						/>
					</div>

					<DialogFooter>
						<Button disabled={loading} onClick={handleSubmit}>
							Создать
						</Button>
						<Button
							variant='outline'
							onClick={() => setIsOpenCreateModal(false)}
						>
							Отмена
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
