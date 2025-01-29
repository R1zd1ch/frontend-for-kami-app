import { Book } from '@/lib/types'
import { BookCard } from './BookCard'
import { useEffect, useState } from 'react'
import { Frown } from 'lucide-react'

export function BookList({
	books,
	isCatalog,
	userId,
	catalogSearchTerm = '',
	userSearchTerm = '',
	isFavouritePage,
}: {
	books: Book[]
	isCatalog: boolean
	userId: string
	isFavouritePage: boolean
	catalogSearchTerm?: string
	userSearchTerm?: string
}) {
	const [isEmpty, setIsEmpty] = useState(false)
	const [isEmptySearchTerm, setIsEmptySearchTerm] = useState(true)

	useEffect(() => {
		if (books.length === 0) {
			setIsEmpty(true)
		} else {
			setIsEmpty(false)
		}
	}, [books])

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (catalogSearchTerm === '') {
				setIsEmptySearchTerm(true)
			} else {
				setIsEmptySearchTerm(false)
			}
		}, 0)

		return () => clearTimeout(timeout)
	}, [catalogSearchTerm])

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-4 h-full'>
			{isCatalog
				? isEmpty && (
						<div className='col-span-full mx-auto h-full pt-4'>
							<div className='flex flex-row gap-4 items-center'>
								{!isEmptySearchTerm ? <Frown className='w-6 h-6' /> : <></>}
								<p className='text-muted-foreground text-xl'>
									{!isEmptySearchTerm ? 'Ничего не найдено' : 'Введите запрос'}
								</p>
							</div>
						</div>
				  )
				: // Сообщение для пользовательских коллекций
				  isEmpty && (
						<div className='col-span-full mx-auto h-full pt-4'>
							<div className='flex flex-row gap-4 items-center'>
								{userSearchTerm ? <Frown className='w-6 h-6' /> : <></>}
								<p className='text-muted-foreground text-xl'>
									{userSearchTerm ? 'Ничего не найдено' : 'Добавьте книги'}
								</p>
							</div>
						</div>
				  )}

			{books.map((book: Book) => (
				<BookCard
					isFavouritePage={isFavouritePage}
					key={book.id || book.externalId}
					book={book}
					isCatalog={isCatalog}
					userId={userId}
				/>
			))}
		</div>
	)
}
