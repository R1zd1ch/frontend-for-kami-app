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
import { Mood } from '@/lib/types'
import { useEffect, useState } from 'react'
import { addDays, format } from 'date-fns'
import MoodCard from './MoodCard'
import CreateMoodModal from './CreateModal'
import { createMood, deleteMood } from '@/api/mood'

const formatDate = (date: Date) =>
	date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})

const MoodDayModalList = ({
	id,
	isDialogOpen,
	setIsDialogOpen,
	selectedDay,
	handleGetMoodsByDay,
	refreshData,
}: {
	id: string
	isDialogOpen: boolean
	setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
	selectedDay: Date | null
	handleGetMoodsByDay: (
		startCurrentDay: string,
		endCurrentDay: string
	) => Promise<Mood[]>
	refreshData: () => Promise<void>
}) => {
	const [moods, setMoods] = useState<Mood[] | null>([])
	const [isOpenCreateModal, setIsOpenCreateModal] = useState(false)

	useEffect(() => {
		setMoods(null)
		async function getMoods() {
			if (selectedDay) {
				const startCurrentDay = new Date(selectedDay)
				startCurrentDay.setHours(0, 0, 0, 0)
				const endCurrentDay = new Date(selectedDay)
				endCurrentDay.setHours(23, 59, 59, 59)
				const response = await handleGetMoodsByDay(
					format(startCurrentDay, 'yyyy-MM-dd'),
					format(addDays(endCurrentDay, 1), 'yyyy-MM-dd')
				)

				// console.log(response)
				const filteredMoods = response?.filter((mood: Mood) => {
					const date = new Date(mood.date)
					return date.getDay() === selectedDay.getDay()
				})
				setMoods(filteredMoods)
			}
		}

		getMoods()
	}, [isDialogOpen, selectedDay])

	const handleCreateMood = async (
		moodLevel: number,
		note: string,
		date: string
	) => {
		setIsOpenCreateModal(true)
		setIsDialogOpen(false)
		const response = await createMood(id, {
			moodLevel,
			note,
			date: new Date(date),
		})

		if (response) {
			refreshData()
			setIsDialogOpen(true)
			setIsOpenCreateModal(false)
			if (moods) {
				setMoods([...moods, response])
			}

			if (moods === null) {
				setMoods([response])
			}
		}
	}

	const handleDelete = async (moodId: string) => {
		await deleteMood(id, moodId)
		if (moods) {
			setMoods([...moods].filter(mood => mood.id !== moodId))
		}

		await refreshData()
	}

	return (
		<>
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent className='min-h-[600px] flex flex-col justify-between	'>
					<DialogHeader>
						<DialogTitle>
							Настроения за {selectedDay && formatDate(selectedDay)}
						</DialogTitle>
						<DialogDescription>
							Здесь вы можете просмотреть или изменить настроения за выбранный
							день.
						</DialogDescription>
					</DialogHeader>
					<div className='flex-1'>
						<div className='max-h-[400px] min-h-[400px] sm:max-h-[500px] sm:min-h-[500px] overflow-y-auto space-y-2'>
							{moods &&
								moods.length > 0 &&
								moods.map(mood => (
									<MoodCard
										key={mood.id}
										mood={mood}
										handleDelete={handleDelete}
										refreshData={refreshData}
									></MoodCard>
								))}
						</div>
					</div>

					<DialogFooter className='w-full flex flex-row gap-2 justify-end'>
						<Button onClick={() => setIsOpenCreateModal(true)}>Создать</Button>
						<Button onClick={() => setIsDialogOpen(false)}>Закрыть</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<CreateMoodModal
				selectedDay={selectedDay ? selectedDay : new Date()}
				handleCreateMood={handleCreateMood}
				isOpenCreateModal={isOpenCreateModal}
				setIsOpenCreateModal={setIsOpenCreateModal}
			></CreateMoodModal>
		</>
	)
}

export default MoodDayModalList
