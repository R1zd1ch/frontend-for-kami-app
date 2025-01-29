'use client'

import { Smile } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SelectPixelsManager from './SelectPixelsManager'
import RecentMood from './RecentlyMood'

import { createMood, getAverageMoodByInterval, getMoodsByDay } from '@/api/mood'
import { endOfWeek, format, startOfWeek } from 'date-fns'
import Clock from './Clock'
import { Mood } from '@/lib/types'
import Charts from './Charts/Charts'
import CreateMoodModal from './CreateModal'

interface MoodBoardProps {
	id: string
}

const buttonSize = 'sm'

const MoodBoard = ({ id }: MoodBoardProps) => {
	const [selectCalendarButton, setSelectCalendarButton] = useState('Year')
	const [averagesYearly, setAveragesYearly] = useState([])
	const [averagesMonthly, setAveragesMonthly] = useState([])
	const [averagesWeekly, setAveragesWeekly] = useState([])
	const [averagesDaily, setAveragesDaily] = useState([])
	const [recentMoodKey, setRecentMoodKey] = useState(0)
	const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)

	const currentYear = new Date().getFullYear()
	const now = new Date()

	const fetchMoodInterval = async () => {
		setRecentMoodKey(recentMoodKey + 1)
		switch (selectCalendarButton) {
			case 'Year':
				const startCurrentYear = format(
					new Date(currentYear, 0, 1),
					'yyyy-MM-dd'
				)
				const endCurrentYear = format(
					new Date(currentYear + 1, 0, 1),
					'yyyy-MM-dd'
				)
				const responseYearly = await getAverageMoodByInterval(
					id,
					startCurrentYear,
					endCurrentYear,
					'year'
				)
				setAveragesYearly(responseYearly)
				break
			case 'Month':
				const startCurrentMonth = format(
					new Date(currentYear, new Date().getMonth() + 0, 1),
					'yyyy-MM-dd'
				)
				const endCurrentMonth = format(
					new Date(currentYear, new Date().getMonth() + 1, 1),
					'yyyy-MM-dd'
				)

				const responseMonthly = await getAverageMoodByInterval(
					id,
					startCurrentMonth,
					endCurrentMonth,
					'month'
				)
				setAveragesMonthly(responseMonthly)
				console.log(responseMonthly)
				break
			case 'Week':
				const weekStart = startOfWeek(now, { weekStartsOn: 1 })
				// Конец недели - воскресенье
				const weekEnd = endOfWeek(now, { weekStartsOn: 2 })

				const startCurrentWeek = format(weekStart, 'yyyy-MM-dd')
				const endCurrentWeek = format(weekEnd, 'yyyy-MM-dd')
				const responseWeekly = await getAverageMoodByInterval(
					id,
					startCurrentWeek,
					endCurrentWeek,
					'week'
				)
				console.log('week', responseWeekly)
				setAveragesWeekly(responseWeekly)
				break

			case 'Day':
				const responseDaily = await getAverageMoodByInterval(
					id,
					format(now, 'yyyy-MM-dd'),
					format(now, 'yyyy-MM-dd'),
					'day'
				)
				setAveragesDaily(responseDaily)
				break
		}
	}

	useEffect(() => {
		fetchMoodInterval()
	}, [selectCalendarButton])

	const handleGetMoodsByDay = async (
		startCurrentDay: string,
		endCurrentDay: string
	): Promise<Mood[]> => {
		console.log(startCurrentDay, endCurrentDay)
		const responseDaily = await getMoodsByDay(
			id,
			startCurrentDay,
			endCurrentDay
		)
		console.log(responseDaily)
		return responseDaily
	}

	const handleCreateMood = async (
		moodLevel: number,
		note: string,
		date: string
	) => {
		setIsOpenCreateModal(true)

		const response = await createMood(id, {
			moodLevel,
			note,
			date: new Date(date),
		})

		if (response) {
			await fetchMoodInterval()

			setIsOpenCreateModal(false)
		}
	}

	return (
		<div className='container mx-auto  space-y-6'>
			<div className='flex flex-row justify-between'>
				<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
					<div className='flex flex-col'>
						<div className='flex items-center gap-2'>
							<Smile className='h-8 w-8' />
							<h1 className='text-3xl font-bold'>Трекер настроения</h1>
						</div>
						<p className='text-muted-foreground mt-2'>
							Здесь вы можете добавлять и отслеживать своё настроение
						</p>
					</div>
				</div>
				<div className='flex flex-row gap-4 items-center'>
					<Button onClick={() => setIsOpenCreateModal(true)}>
						Добавить за сегодня
					</Button>
					<CreateMoodModal
						handleCreateMood={handleCreateMood}
						selectedDay={new Date()}
						isOpenCreateModal={isOpenCreateModal}
						setIsOpenCreateModal={setIsOpenCreateModal}
					></CreateMoodModal>
					<Clock></Clock>
				</div>
			</div>

			<div className='grid gap-6 md:grid-cols-3 lg:grid-cols-4'>
				<Card className='md:col-span-2 lg:col-span-3'>
					<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
						<CardTitle className='text-xl font-medium'>
							Выберите отображение календаря для добавления настроения
						</CardTitle>
						<div className='flex flex-wrap gap-2'>
							{['Year', 'Month', 'Week'].map(period => (
								<Button
									key={period}
									onClick={() => setSelectCalendarButton(period)}
									size={buttonSize}
									variant={
										selectCalendarButton === period ? 'default' : 'outline'
									}
								>
									{period === 'Year'
										? 'Год'
										: period === 'Month'
										? 'Месяц'
										: period === 'Week'
										? 'Неделя'
										: 'День'}
								</Button>
							))}
						</div>
					</CardHeader>
					<CardContent className='pt-6'>
						<SelectPixelsManager
							id={id}
							year={currentYear}
							selectState={selectCalendarButton}
							averageDailyMood={averagesDaily}
							averageWeeklyMood={averagesWeekly}
							averageMonthlyMood={averagesMonthly}
							averageYearlyMood={averagesYearly}
							handleGetMoodsByDay={handleGetMoodsByDay}
							refreshData={fetchMoodInterval}
						/>
					</CardContent>
				</Card>
				<div className='md:col-span-1'>
					<RecentMood recentMoodKey={recentMoodKey} id={id} />
				</div>
			</div>

			<Charts id={id} refreshKey={recentMoodKey}></Charts>
		</div>
	)
}

export default MoodBoard
