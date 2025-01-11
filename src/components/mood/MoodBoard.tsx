'use client'
import { Smile } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import SelectPixelsManager from './SelectPixelsManager'
import RecentMood from './RecentMood'

interface MoodBoardProps {}

const buttonSize = 'sm'

const MoodBoard = ({}: MoodBoardProps) => {
	const [selectCalendarButton, setSelectCalendarButton] = useState('Year')
	return (
		<div className='h-screen'>
			<div className='flex flex-row justify-between'>
				<div className='flex flex-col items-start'>
					<div className='flex flex-row gap-2 items-center justify-center'>
						<Smile />
						<h1 className='text-2xl font-bold'>Трекер настроения</h1>
					</div>
					<p className='text-muted-foreground text-sm'>
						Здесь вы можете добавлять и отслеживать своё настроение в течении
						дня, недели, месяца и года
					</p>
				</div>
			</div>
			<div className='grid grid-cols-8 mt-4 gap-8'>
				<div className='col-span-5'>
					<div className='flex flex-row justify-between'>
						<div>
							<h1 className='text-xl font-medium'>
								Выберите отображение календаря для добавления настроения
							</h1>
						</div>
						<div className='flex flex-row gap-2 itmes-center'>
							<Button
								onClick={() => setSelectCalendarButton('Year')}
								size={buttonSize}
								className={`${
									selectCalendarButton === 'Year' ? 'bg-primary' : 'bg-muted'
								}`}
							>
								Год
							</Button>
							<Button
								onClick={() => setSelectCalendarButton('Month')}
								size={buttonSize}
								className={`${
									selectCalendarButton === 'Month' ? 'bg-primary' : 'bg-muted'
								}`}
							>
								Месяц
							</Button>
							<Button
								onClick={() => setSelectCalendarButton('Week')}
								size={buttonSize}
								className={`${
									selectCalendarButton === 'Week' ? 'bg-primary' : 'bg-muted'
								}`}
							>
								Неделя
							</Button>
							<Button
								onClick={() => setSelectCalendarButton('Day')}
								size={buttonSize}
								className={`${
									selectCalendarButton === 'Day' ? 'bg-primary' : 'bg-muted'
								}`}
							>
								День
							</Button>
						</div>
					</div>
					<div className='mt-4'>
						<SelectPixelsManager
							selectState={selectCalendarButton}
						></SelectPixelsManager>
					</div>
				</div>

				<div className='col-span-3 '>
					<div className='mb-4'>
						<h1 className='text-xl font-medium'>Последние записи</h1>
						{/* <p className='text-sm text-muted-foreground'>
							Здесь отображаются ваши последнии изменения настроения
						</p> */}
					</div>
					<RecentMood></RecentMood>
				</div>
			</div>
		</div>
	)
}

export default MoodBoard
