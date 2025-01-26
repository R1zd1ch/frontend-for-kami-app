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
import { MonthAverageMood, Mood } from '@/lib/types'

interface MonthPixelsProps {
	id: string
	initialDate?: Date
	averageMonthlyMood?: MonthAverageMood[]
	// onDayClick: (day: number) => void
	handleGetMoodsByDay: (startDay: string, endDay: string) => Promise<Mood[]>
	refreshData: () => Promise<void>
}

const MonthPixels: React.FC<MonthPixelsProps> = ({
	id,
	initialDate,
	// onDayClick,
	averageMonthlyMood,
	handleGetMoodsByDay,
	refreshData,
}) => {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [currentDate, setCurrentDate] = useState(initialDate || new Date())
	const [days, setDays] = useState<Date[]>([])
	const [selectedDay, setSelectedDay] = useState<Date | null>(null)
	const [ModalIsOpen, setModalIsOpen] = useState(false)

	// Генерация массива дат для текущего месяца
	useEffect(() => {
		const daysInMonth: Date[] = []
		const year = currentDate.getFullYear()
		const month = currentDate.getMonth()
		const lastDay = new Date(Date.UTC(year, month + 1, 0))

		// Добавляем только дни текущего месяца
		for (let d = 1; d <= lastDay.getDate(); d++) {
			daysInMonth.push(new Date(Date.UTC(year, month, d)))
		}

		setDays(daysInMonth)
	}, [currentDate])

	// Создание мапы для настроений по дням
	const moodMap = useMemo(() => {
		const map = new Map<string, number | null>()
		if (averageMonthlyMood && averageMonthlyMood.length > 0) {
			averageMonthlyMood[0].days.forEach(day => {
				const dateKey = day.date.split('T')[0]
				map.set(dateKey, day.average)
			})
		}
		return map
	}, [averageMonthlyMood])

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

	// Форматирование даты
	const formatDate = (date: Date) =>
		date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		})

	// Проверка, является ли день сегодняшним
	const today = new Date()
	const isToday = (day: Date) => today.toDateString() === day.toDateString()

	// Обработчик клика по дню
	const handleDayClick = (day: Date) => {
		setSelectedDay(day)
		setModalIsOpen(true)
	}

	return (
		<>
			<div className='space-y-4'>
				<div className='flex justify-center items-center'>
					<h2 className='text-xl font-semibold'>
						{currentDate.toLocaleDateString('ru-RU', {
							month: 'long',
							year: 'numeric',
						})}
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
					{days.map((day, index) => {
						const dateKey = day.toISOString().split('T')[0]
						const mood = moodMap.get(dateKey)
						const moodColor = getMoodColor(mood)

						return (
							<TooltipProvider key={index}>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											className={`w-full h-10 p-0 ${moodColor} ${
												isToday(day) ? 'ring-2 ring-primary' : ''
											} hover:brightness-90 transition-all`}
											onClick={() => handleDayClick(day)}
											aria-label={formatDate(day)}
										>
											{day.getDate()}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										<p>{formatDate(day)}</p>
										{mood !== null && mood !== undefined && (
											<>
												<p>Настроение: {mood.toFixed(1)}</p>
											</>
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

export default MonthPixels
