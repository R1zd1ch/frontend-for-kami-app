'use client'
import { FC } from 'react'
import WeeklyChart from './WeeklyChart'
import type React from 'react'
import MonthlyChart from './MonthlyChart'
import YearlyChart from './YearlyChart'

interface ChartsProps {
	id: string
	refreshKey: number
}

const Charts: FC<ChartsProps> = ({ id, refreshKey }) => {
	return (
		<div className='grid gap-6 md:grid-cols-2'>
			<WeeklyChart id={id} refreshKey={refreshKey}></WeeklyChart>
			<MonthlyChart id={id} refreshKey={refreshKey}></MonthlyChart>
			<div className='md:col-span-2'>
				<YearlyChart id={id} refreshKey={refreshKey}></YearlyChart>
			</div>
		</div>
	)
}

export default Charts
