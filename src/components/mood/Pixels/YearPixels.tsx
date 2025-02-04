'use client'

import type React from 'react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import MoodDayModalList from '../MoodDayModalList'
import type { YearAverageMood, DayAverageMood, Mood } from '@/lib/types'

interface YearPixelsProps {
	id: string
	year: number
	averageYearlyMood: YearAverageMood[]
	handleGetMoodsByDay: (
		startCurrentDay: string,
		endCurrentDay: string
	) => Promise<Mood[]>
	refreshData: () => Promise<void>
}

const formatToLocalDate = (utcDate: string): string => {
	// Преобразуем дату в объект Date
	const date = new Date(utcDate)
	// Смещаем на локальный часовой пояс
	const localDate = new Date(date.getTime())

	// Форматируем в локальную дату
	const year = localDate.getFullYear()
	const month = String(localDate.getMonth() + 1).padStart(2, '0')
	const day = String(localDate.getDate()).padStart(2, '0')
	return `${year}-${month}-${day}`
}

const YearGrid: React.FC<YearPixelsProps> = ({
	id,
	year,
	averageYearlyMood,
	handleGetMoodsByDay,
	refreshData,
}) => {
	const [selectedDay, setSelectedDay] = useState<Date | null>(null)
	const [modalIsOpen, setModalIsOpen] = useState(false)

	const months = useMemo(() => {
		return Array.from({ length: 12 }, (_, i) => {
			const date = new Date(year, i, 1)
			return {
				name: date.toLocaleString('ru-RU', { month: 'short' }),
				days: getDaysInMonth(year, i),
			}
		})
	}, [year])

	const moodMap = useMemo(() => {
		const map = new Map<string, number | null>()
		if (averageYearlyMood.length > 0) {
			averageYearlyMood[0].days.forEach((day: DayAverageMood) => {
				if (day.date === null) return
				// console.log(day)

				const localDateKey = formatToLocalDate(day.date)
				map.set(localDateKey, day.average)
			})
		}
		return map
	}, [averageYearlyMood])

	const getMoodColor = (mood: number | null | undefined) => {
		if (mood === null || mood === undefined) return 'bg-gray-200'
		if (mood >= 0 && mood < 2) return 'bg-red-200'
		if (mood >= 2 && mood < 4) return 'bg-orange-200'
		if (mood >= 4 && mood < 6) return 'bg-yellow-200'
		if (mood >= 6 && mood < 8) return 'bg-lime-200'
		if (mood >= 8 && mood <= 10) return 'bg-green-200'
		return 'bg-gray-200'
	}

	const formatDate = (date: Date) =>
		date.toLocaleDateString('ru-RU', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		})

	const today = new Date()
	const isToday = (day: Date) => today.toDateString() === day.toDateString()

	const handleDayClick = (day: Date) => {
		setSelectedDay(day)
		setModalIsOpen(true)
	}

	return (
		<>
			<TooltipProvider>
				<div className='grid grid-cols-4 gap-1 gap-x-6 p-1'>
					{months.map((month, monthIndex) => (
						<div key={monthIndex} className='text-xs'>
							<div className='font-semibold mb-1'>{month.name}</div>
							<div className='grid grid-cols-7 gap-y-1'>
								{month.days.map((day, dayIndex) => {
									const dateKey = formatToLocalDate(day.toDateString())
									const mood = moodMap.get(dateKey)
									const moodColor = getMoodColor(mood)

									return (
										<Tooltip key={dayIndex}>
											<TooltipTrigger asChild>
												<Button
													className={`w-5 h-5 m-0 p-0 ${moodColor} ${
														isToday(day) ? 'ring-1 ring-primary' : ''
													} hover:brightness-90 transition-all text-[0.7rem]`}
													onClick={() => handleDayClick(day)}
													aria-label={formatDate(day)}
												>
													{day.getDate()}
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>{formatDate(day)}</p>
												{mood !== null && mood !== undefined && (
													<p>Настроение: {mood.toFixed(1)}</p>
												)}
											</TooltipContent>
										</Tooltip>
									)
								})}
							</div>
						</div>
					))}
				</div>

				<MoodDayModalList
					id={id}
					isDialogOpen={modalIsOpen}
					setIsDialogOpen={setModalIsOpen}
					selectedDay={selectedDay}
					handleGetMoodsByDay={handleGetMoodsByDay}
					refreshData={refreshData}
				/>
			</TooltipProvider>
		</>
	)
}

function getDaysInMonth(year: number, month: number) {
	const date = new Date(year, month, 1)
	const days = []
	while (date.getMonth() === month) {
		// Создаём дату с обнулением времени
		days.push(new Date(date.getFullYear(), date.getMonth(), date.getDate()))
		date.setDate(date.getDate() + 1)
	}
	return days
}

export default YearGrid
