import { Suspense } from 'react'
import getSession from '@/lib/getSession'
import MoodBoard from '@/components/mood/MoodBoard'
import {
	getMoodsByCurrentDay,
	getMoodsByCurrentWeek,
	getMoodsByCurrentMonth,
} from '@/api/mood'
export const dynamic = 'force-dynamic'

export default async function Page() {
	const session = await getSession()
	const token = session?.tokens.accessToken
	const id = session?.user.id
	const moods = await getMoodsByCurrentDay(id as string, token as string)
	return (
		<div className='p-2 md:p-6 max-h-[98vh] overflow-y-auto'>
			<Suspense fallback={<div>Loading...</div>}>
				<MoodBoard id={id as string} token={token as string} moods={moods} />
			</Suspense>
		</div>
	)
}
