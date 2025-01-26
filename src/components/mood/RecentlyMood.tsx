'use client'

import { useEffect, useState } from 'react'
import {
	Select,
	SelectGroup,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectItem,
} from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { getRecentMoods } from '@/api/mood'
import { Mood } from '@/lib/types'
import RecentlyCard from './RecentlyCard'

interface GettedRecentMoods {
	recentCreated: Mood[]
	recentUpdated: Mood[]
}

const RecentMood = ({
	id,
	recentMoodKey,
}: {
	id: string
	recentMoodKey: number
}) => {
	const [headerState, setHeaderState] = useState('creates')
	const [recentMoods, setRecentMoods] = useState<GettedRecentMoods>({
		recentCreated: [],
		recentUpdated: [],
	})

	useEffect(() => {
		const fetchRecent = async () => {
			const res = await getRecentMoods(id)

			setRecentMoods(res)
		}

		fetchRecent()
	}, [headerState, recentMoodKey])

	return (
		<Card className='h-full'>
			<CardHeader className='flex flex-row gap-2 items-center justify-center'>
				<CardTitle className='text-xl font-medium'>Последние</CardTitle>
				<Select value={headerState} onValueChange={setHeaderState}>
					<SelectTrigger>
						<SelectValue
							placeholder={
								headerState === 'creates' ? 'обновления' : 'добавления'
							}
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value='updates'>обновления</SelectItem>
							<SelectItem value='creates'>добавления</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className='h-fit  '>
				<div className='overflow-y-auto max-h-[500px] space-y-4'>
					{headerState === 'creates'
						? recentMoods.recentCreated.map(mood => (
								<RecentlyCard
									key={mood.id}
									mood={mood}
									created={true}
								></RecentlyCard>
						  ))
						: recentMoods.recentUpdated.map(mood => (
								<RecentlyCard
									key={mood.id}
									mood={mood}
									updated={true}
								></RecentlyCard>
						  ))}
				</div>
			</CardContent>
		</Card>
	)
}

export default RecentMood
