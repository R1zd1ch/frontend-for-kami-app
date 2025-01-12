import { Suspense } from 'react'
import getSession from '@/lib/getSession'
import { getTasks } from '@/api/tasks'
import TaskBoard from '@/components/tasks/TaskBoard'

export const dynamic = 'force-dynamic'

export const revalidate = 1

export default async function Page() {
	const session = await getSession()
	const token = session?.tokens.accessToken
	const id = session?.user.id
	const tasks = await getTasks(id as string, token as string)

	return (
		<div className='p-2 md:p-6 max-h-[98vh]'>
			<div className=' '>
				<Suspense fallback={<div>Loading...</div>}>
					<TaskBoard
						id={id as string}
						token={token as string}
						initialTasks={tasks}
					></TaskBoard>
				</Suspense>
			</div>
		</div>
	)
}
