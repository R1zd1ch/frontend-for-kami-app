/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import MonthPixels from './Pixels/MonthPixels'
import WeekPixels from './Pixels/WeekPixels'
import YearPixels from './Pixels/YearPixels'
import {
	DayAverageMood,
	MonthAverageMood,
	Mood,
	WeekAverageMood,
	YearAverageMood,
} from '@/lib/types'

interface SelectPixelsManagerProps {
	id: string
	selectState: string
	year: number
	averageDailyMood: DayAverageMood[]
	averageWeeklyMood: WeekAverageMood[]
	averageMonthlyMood: MonthAverageMood[]
	averageYearlyMood: YearAverageMood[]
	handleGetMoodsByDay: (
		startCurrentDay: string,
		endCurrentDay: string
	) => Promise<Mood[]>
	refreshData: () => Promise<void>
	handleGetMoodsByHour: (startHour: string, endHour: string) => Promise<Mood[]>
}

const SelectPixelsManager = ({
	selectState,
	year,

	averageWeeklyMood,
	averageMonthlyMood,
	averageYearlyMood,
	handleGetMoodsByDay,
	refreshData,
	id,
}: SelectPixelsManagerProps) => {
	return (
		<div className='min-h-[500px]'>
			{selectState === 'Year' && (
				<>
					<YearPixels
						year={year}
						id={id}
						averageYearlyMood={averageYearlyMood}
						handleGetMoodsByDay={handleGetMoodsByDay}
						refreshData={refreshData}
					></YearPixels>
					<div>
						<div className='flex flex-col items-center justify-center'></div>
					</div>
				</>
			)}
			{selectState === 'Month' && (
				<MonthPixels
					id={id}
					averageMonthlyMood={averageMonthlyMood}
					handleGetMoodsByDay={handleGetMoodsByDay}
					refreshData={refreshData}
				></MonthPixels>
			)}
			{selectState === 'Week' && (
				<WeekPixels
					id={id}
					averageWeeklyMood={averageWeeklyMood}
					handleGetMoodsByDay={handleGetMoodsByDay}
					refreshData={refreshData}
				></WeekPixels>
			)}
		</div>
	)
}

export default SelectPixelsManager
