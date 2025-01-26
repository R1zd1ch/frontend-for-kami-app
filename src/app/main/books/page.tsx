import { Suspense } from 'react'
import getSession from '@/lib/getSession'
import BooksBoard from '@/components/books/BooksBoard'

export const dynamic = 'force-dynamic'

export default async function Page() {
	const session = await getSession()
	const id = session?.user.id
	return (
		<div className='p-2 md:p-6 max-h-[98vh] overflow-y-auto'>
			<Suspense fallback={<div>Loading...</div>}>
				<BooksBoard id={id as string}></BooksBoard>
			</Suspense>
		</div>
	)
}
