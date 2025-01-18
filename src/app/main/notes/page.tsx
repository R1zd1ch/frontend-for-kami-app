import { Suspense } from 'react'
import getSession from '@/lib/getSession'
import NoteBoard from '@/components/notes/NoteBoard'
export const dynamic = 'force-dynamic'

export default async function Page() {
	const session = await getSession()
	const id = session?.user.id

	return (
		<div className='p-2 md:p-6 max-h-[98vh]'>
			<div className=' '>
				<Suspense fallback={<div>Loading...</div>}>
					<NoteBoard id={id as string}></NoteBoard>
				</Suspense>
			</div>
		</div>
	)
}
