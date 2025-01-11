import { Suspense } from 'react'
import getSession from '@/lib/getSession'
import { getAllNotes } from '@/api/notes'
import NoteBoard from '@/components/notes/NoteBoard'

export default async function Page() {
	const session = await getSession()
	const token = session?.tokens.accessToken
	const id = session?.user.id
	const notes = await getAllNotes(id as string, token as string)

	return (
		<div className='p-2 md:p-6 max-h-[98vh]'>
			<div className=' '>
				<Suspense fallback={<div>Loading...</div>}>
					<NoteBoard
						id={id as string}
						token={token as string}
						initialNotes={notes}
					></NoteBoard>
				</Suspense>
			</div>
		</div>
	)
}
