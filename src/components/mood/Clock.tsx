'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

const Clock: React.FC = () => {
	const [time, setTime] = useState(new Date())
	const [mount, setMount] = useState(false)
	const [isVisibleDots, setIsVisibleDots] = useState(true)

	useEffect(() => {
		setIsVisibleDots(!isVisibleDots)
	}, [time])

	useEffect(() => {
		const interval = setInterval(() => {
			setTime(new Date())
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	useEffect(() => {
		setMount(true)
	}, [])

	const hours = time.getHours().toString().padStart(2, '0')
	const minutes = time.getMinutes().toString().padStart(2, '0')
	const seconds = time.getSeconds().toString().padStart(2, '0')
	const today = format(time, 'dd MMMM yyyy ', { locale: ru })

	return (
		<>
			{mount && (
				<div>
					<Card className='flex justify-center items-center  bg-background p-2'>
						<div className='text-xl lg:text-3xl font-bold text-foreground space-x-1 lg:space-x-2 flex'>
							<span className='transition-all  w-4 h-8  transform duration-500 ease-in-out'>
								{hours[0]}
							</span>
							<span className='transition-all  w-4 h-8  transform duration-500 ease-in-out'>
								{hours[1]}
							</span>
							<span
								className={`text-xl lg:text-2xl ${
									isVisibleDots && 'opacity-30'
								}`}
							>
								:
							</span>
							<span className='transition-all  w-4 h-8  transform duration-500 ease-in-out'>
								{minutes[0]}
							</span>
							<span className='transition-all  w-4 h-8  transform duration-500 ease-in-out'>
								{minutes[1]}
							</span>
							<span
								className={`hidden lg:inline-block text-xl lg:text-2xl ${
									isVisibleDots && 'opacity-30'
								}`}
							>
								:
							</span>
							<span className='hidden w-4 h-8 lg:inline-block transition-all transform duration-500 ease-in-out'>
								{seconds[0]}
							</span>
							<span className='hidden w-4 h-8 lg:inline-block transition-all transform duration-500 ease-in-out'>
								{seconds[1]}
							</span>
						</div>
					</Card>
					<div className='text-center'>Сегодня: {today}</div>
				</div>
			)}

			{!mount && <></>}
		</>
	)
}

export default Clock
