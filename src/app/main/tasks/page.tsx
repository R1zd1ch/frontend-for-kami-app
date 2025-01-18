'use server'

import { Suspense } from 'react'
import getSession from '@/lib/getSession'
import TaskBoard from '@/components/tasks/TaskBoard'
import { cookies } from 'next/headers'

export default async function Page() {
	const session = await getSession()
	const id = session?.user.id

	const cookiesStore = await cookies()
	const token = cookiesStore.get('accessToken')?.value

	return (
		<div className='p-2 md:p-6 max-h-[98vh]'>
			<div className=' '>
				<Suspense fallback={<div>Loading...</div>}>
					<TaskBoard id={id as string} token={token as string}></TaskBoard>
				</Suspense>
			</div>
		</div>
	)
}
