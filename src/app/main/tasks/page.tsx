'use server'

import { Suspense } from 'react'
import getSession from '@/lib/getSession'
import TaskBoard from '@/components/tasks/TaskBoard'

export default async function Page() {
	const session = await getSession()
	const id = session?.user.id

	return (
		<div className='p-2 md:p-6 max-h-[98vh]'>
			<div className=' '>
				<Suspense fallback={<div>Loading...</div>}>
					<TaskBoard id={id as string}></TaskBoard>
				</Suspense>
			</div>
		</div>
	)
}
