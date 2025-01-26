'use client'

import type React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import MoodDayModalList from '../MoodDayModalList'
import { Mood, WeekAverageMood } from '@/lib/types'

interface WeekPixelsProps {
	id: string
	initialDate?: Date
	averageWeeklyMood?: WeekAverageMood[]
	handleGetMoodsByDay: (startDay: string, endDay: string) => Promise<Mood[]>
	refreshData: () => Promise<void>
}

const WeekPixels: React.FC<WeekPixelsProps> = ({
	id,
	initialDate = new Date(),
	averageWeeklyMood,
	handleGetMoodsByDay,
	refreshData,
}) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [currentDate, setCurrentDate] = useState(initialDate)
	const [weekDays, setWeekDays] = useState<Date[]>([])
	const [selectedDay, setSelectedDay] = useState<Date | null>(null)
	const [ModalIsOpen, setModalIsOpen] = useState(false)

	// Генерация дней недели (в UTC)
	useEffect(() => {
		const days: Date[] = []
		const dayOfWeek = currentDate.getUTCDay()

		// Если сегодня воскресенье (dayOfWeek === 0), то сдвигаем на 6 дней назад, чтобы получить понедельник
		const startOfWeek = new Date(
			Date.UTC(
				currentDate.getUTCFullYear(),
				currentDate.getUTCMonth(),
				currentDate.getUTCDate()
			)
		)
		startOfWeek.setUTCDate(
			currentDate.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
		)

		// Заполняем массив с датами недели (с понедельника по воскресенье в UTC)
		for (let i = 0; i < 7; i++) {
			const day = new Date(startOfWeek)
			day.setUTCDate(startOfWeek.getUTCDate() + i)
			days.push(day)
		}

		setWeekDays(days)
	}, [currentDate])

	console.log(
		'weekDays',
		weekDays,
		'today',
		currentDate,
		'averageWeeklyMood',
		averageWeeklyMood
	)

	// Создание мапы для настроений по дням (в UTC)
	const moodMap = useMemo(() => {
		const map = new Map<string, number | null>()
		if (averageWeeklyMood && averageWeeklyMood.length > 0) {
			averageWeeklyMood[0].days.slice(1).forEach(day => {
				// Преобразуем дату в UTC
				const dateKey = new Date(day.date).toISOString().split('T')[0]
				map.set(dateKey, day.average)
			})
			const dateKey = new Date(averageWeeklyMood[0].days[0].date)
				.toISOString()
				.split('T')[0]
			map.set(dateKey, averageWeeklyMood[0].days[0].average)
		}

		return map
	}, [averageWeeklyMood])
	console.log('weekMap', moodMap)

	// Функция для получения цвета в зависимости от настроения
	const getMoodColor = (mood: number | null | undefined) => {
		if (mood === null || mood === undefined) return 'bg-gray-200'

		if (mood >= 0 && mood < 2) {
			return 'bg-red-200'
		} else if (mood >= 2 && mood < 4) {
			return 'bg-orange-200'
		} else if (mood >= 4 && mood < 6) {
			return 'bg-yellow-200'
		} else if (mood >= 6 && mood < 8) {
			return 'bg-lime-200'
		} else if (mood >= 8 && mood <= 10) {
			return 'bg-green-200'
		} else {
			return 'bg-gray-200'
		}
	}

	// Форматирование даты в UTC
	const formatDate = (date: Date) =>
		date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		})

	// Проверка, является ли день сегодняшним
	const today = new Date()
	const isToday = (day: Date) =>
		today.toISOString().split('T')[0] === day.toISOString().split('T')[0]

	// Обработчик клика по дню
	const handleDayClick = (day: Date) => {
		setSelectedDay(day)
		setModalIsOpen(true)
	}

	// Форматирование диапазона недели в UTC
	const formatWeekRange = (start: Date | undefined, end: Date | undefined) => {
		if (
			!start ||
			!end ||
			!(start instanceof Date) ||
			!(end instanceof Date) ||
			isNaN(start.getTime()) ||
			isNaN(end.getTime())
		) {
			return 'Invalid Date Range'
		}
		const startStr = start.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
		})
		const endStr = end.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		})
		return `${startStr} - ${endStr}`
	}

	return (
		<>
			<div className='space-y-4'>
				<div className='flex justify-between items-center'>
					<h2 className='text-xl font-semibold'>
						{formatWeekRange(weekDays[0], weekDays[6])}
					</h2>
				</div>
				<div className='grid grid-cols-7 gap-1'>
					{['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
						<div
							key={day}
							className='text-center text-sm font-medium text-muted-foreground'
						>
							{day}
						</div>
					))}
					{weekDays.map((day, index) => {
						const dateKey = day.toISOString().split('T')[0] // Используем ISO строку для UTC
						console.log('dateKey', dateKey)
						const mood = moodMap.get(dateKey)
						const moodColor = getMoodColor(mood)

						return (
							<TooltipProvider key={index}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											className={`w-full h-20 p-1 flex flex-col items-center justify-center ${moodColor} ${
												isToday(day) ? 'ring-2 ring-primary' : ''
											} hover:brightness-90 transition-all`}
											onClick={() => handleDayClick(day)}
										>
											<span className='text-sm font-semibold'>
												{day.getUTCDate()}
											</span>
											<span className='text-xs text-muted-foreground dark:text-muted'>
												{day.toLocaleDateString('ru-RU', { weekday: 'short' })}
											</span>
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>{formatDate(day)}</p>
										{mood !== null && mood !== undefined && (
											<p>Настроение: {mood.toFixed(1)}</p>
										)}
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)
					})}
				</div>
			</div>

			{/* Модалка с подробной информацией о настроении */}
			<MoodDayModalList
				id={id}
				isDialogOpen={ModalIsOpen}
				setIsDialogOpen={setModalIsOpen}
				selectedDay={selectedDay}
				handleGetMoodsByDay={handleGetMoodsByDay}
				refreshData={refreshData}
			/>
		</>
	)
}

export default WeekPixels
