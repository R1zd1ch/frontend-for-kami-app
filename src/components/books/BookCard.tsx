import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from '@/components/ui/card'
import { Book } from '@/lib/types'
import { Bookmark, Frown, Heart, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useBookStore } from '@/storage/bookStore'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Input } from '../ui/input'
import BookMoreInformation from './BookMoreInformation'

const checkBookStatus = (book: Book) => {
	return (
		book.status === 'reading' ||
		book.status === 'completed' ||
		book.status === 'to-read'
	)
}

export const BookCard = ({
	book,
	isCatalog,
	userId,
	isFavouritePage,
}: {
	book: Book
	isCatalog: boolean
	userId: string
	isFavouritePage: boolean
}) => {
	const {
		toggleFavourite,
		deleteBook,
		updateBook,
		addBook,
		books,
		toggleFavouriteFromCatalog,
	} = useBookStore()

	const [disabledFavourite, setDisabledFavourite] = useState(false)
	const [disabledUpdate, setDisabledUpdate] = useState(false)
	const [progress, setProgress] = useState(book.progress)
	const timeoutId = useRef<NodeJS.Timeout | null>(null)
	const isMounted = useRef(true)
	const lastSentProgress = useRef(progress)

	useEffect(() => {
		return () => {
			isMounted.current = false
			if (timeoutId.current) clearTimeout(timeoutId.current)
		}
	}, [])

	const isFavourite = useMemo(() => {
		if (isCatalog && book?.externalId) {
			return books.some(
				b => b?.externalId === book?.externalId && b?.isFavourite
			)
		}
		return book.isFavourite ?? false
	}, [books, book, isCatalog])

	const isAdded = useMemo(() => {
		if (isCatalog && book.externalId) {
			return books.some(
				b => b.externalId === book.externalId && checkBookStatus(b)
			)
		}
		return checkBookStatus(book)
	}, [books, book, isCatalog])

	const existingBook = useMemo(
		() => books.find(b => b.externalId === book.externalId),
		[books, book.externalId]
	)

	const handleToggleFavourite = async () => {
		try {
			if (isCatalog) {
				setDisabledFavourite(true)

				if (!existingBook) {
					setDisabledUpdate(true)
					await toggleFavouriteFromCatalog(userId, book)
				} else {
					await toggleFavourite(userId, existingBook.id, isFavourite)
				}
			} else {
				await toggleFavourite(userId, book.id, isFavourite)
			}
		} catch (error) {
			console.error('Error:', error)
		} finally {
			setDisabledFavourite(false)
			setDisabledUpdate(false)
		}
	}

	const handleMark = async () => {
		setDisabledUpdate(true)
		if (isAdded) {
			setDisabledFavourite(true)
			try {
				if (isCatalog) {
					const bookToDeletee = books.find(
						item => item.externalId === book.externalId
					)
					console.log(bookToDeletee)
					await deleteBook(userId || '', bookToDeletee?.id || '')
				}
				if (!isCatalog) {
					await deleteBook(userId, book.id)
				}
			} catch (error) {
				console.error('Failed to removerMark', error)
			} finally {
				setDisabledUpdate(false)
				setDisabledFavourite(false)
			}
		}

		if (!isAdded) {
			try {
				await addBook(userId, {
					...book,
					status: 'to-read',
					progress: 0,
				})
			} catch (error) {
				console.error('Failed to add book:', error)
			} finally {
				setDisabledUpdate(false)
			}
		}
	}

	const debouncedUpdate = useCallback(
		async (newProgress: number) => {
			if (lastSentProgress.current === newProgress) return

			if (timeoutId.current) clearTimeout(timeoutId.current)

			timeoutId.current = setTimeout(async () => {
				try {
					await updateBook(userId, book.id, {
						progress: newProgress,
						status:
							newProgress >= parseInt(book.pages, 10) ? 'completed' : 'to-read',
					})
					lastSentProgress.current = newProgress
				} catch (error) {
					console.error('Failed to update progress:', error)
					if (isMounted.current) {
						setProgress(lastSentProgress.current)
					}
				}
			}, 500)
		},
		[userId, book.id, updateBook]
	)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Очищаем ведущие нули и преобразуем в число
		const cleanedValue = e.target.value.replace(/^0+/, '') || '0'
		const value = parseInt(cleanedValue, 10) || 0
		const newProgress = Math.max(0, Math.min(parseInt(book.pages, 10), value))

		// Обновляем состояние и отправляем запрос
		setProgress(newProgress)
		debouncedUpdate(newProgress)

		// Принудительно обновляем значение инпута
		e.target.value = cleanedValue === '' ? '0' : String(newProgress)
	}

	const handleProgressChange = useCallback(
		(delta: number) => {
			setProgress(prev => {
				const newProgress = Math.max(
					0,
					Math.min(parseInt(book.pages, 10), prev + delta)
				)
				debouncedUpdate(newProgress)
				return newProgress
			})
		},
		[book.pages, debouncedUpdate]
	)

	return (
		<Card className='p-4 shadow-lg hover:shadow-xl bg-gradient-to-br from-muted/40 to-primary/10 group overflow-hidden transition-all duration-300'>
			<CardHeader className='p-0'>
				<div className='relative w-full h-60 overflow-hidden rounded-lg'>
					<Image
						src={book.coverUrl || '/placeholder.png'}
						alt={book.title}
						fill
						loading={isCatalog ? 'lazy' : 'eager'}
						quality={100}
						className='object-cover transition-transform duration-300 group-hover:scale-105 progressive'
						style={{
							filter: 'contrast(1.05) saturate(1.1) brightness(1.05)',
						}}
					/>
					<div className='absolute inset-0 bg-gradient-to-bl from-muted/50 to-black/80 flex flex-col justify-end p-4 text-white'>
						<CardTitle className='text-lg font-bold line-clamp-2'>
							{book.title}
						</CardTitle>
						<p className='text-xs line-clamp-1 '>{book.authors.join(', ')}</p>
					</div>
					<div className='absolute top-2 right-2'>
						{book?.categories && book.categories.length > 0 && (
							<Badge>{book.categories.join(' ')}</Badge>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent className='mt-2 p-0 max-h-[60px] min-h-[60px]'>
				<div className='text-sm text-muted-foreground '>
					{book.description ? (
						<p className='line-clamp-3'>{book.description}</p>
					) : (
						<div className='flex flex-row items-center justify-center gap-2 pt-4'>
							<p className='text-center text-lg'>Описания нет</p>
							<Frown className='w-6 h-6'></Frown>
						</div>
					)}
				</div>
			</CardContent>
			<CardFooter
				className={`p-0 m-0 flex gap-2 flex-col mt-4  ${
					!isCatalog && 'flex-col-reverse'
				}`}
			>
				<div className='flex flex-row justify-between w-full'>
					<div className='flex flex-row gap-2'>
						<Button
							size={'sm'}
							variant={'outline'}
							onClick={() => {
								handleMark()
							}}
							disabled={disabledUpdate}
						>
							<Bookmark
								style={{ width: '20px', height: '20px' }}
								fill={`${isAdded ? '#a855f7' : 'transparent'}`}
							/>
						</Button>
						<Button
							size={'sm'}
							onClick={handleToggleFavourite}
							variant={'outline'}
							disabled={disabledFavourite}
						>
							<Heart
								style={{ width: '20px', height: '20px' }}
								fill={`${isFavourite ? '#a855f7' : 'transparent'}`}
							/>
						</Button>
					</div>

					<div>
						{/* <Button size='sm'>Подробнее</Button> */}
						<BookMoreInformation book={book}></BookMoreInformation>
					</div>
				</div>

				{!isCatalog && !isFavouritePage && (
					<div className='flex flex-row justify-between w-full items-center'>
						<div className='text-sm'>
							<p className=''>Прогресс:</p>
							<p>
								{progress} / {book.pages}
							</p>
						</div>
						<div className='flex flex-row items-center gap-1'>
							<Button
								variant={'outline'}
								size={'sm'}
								onClick={() => handleProgressChange(-5)}
								disabled={progress <= 0}
								className='w-8 h-8'
							>
								<Minus style={{ width: '20px', height: '20px' }}></Minus>
							</Button>
							<div>
								<Input
									className='w-16 h-8 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0'
									type='number'
									min={0}
									max={book.pages}
									value={progress}
									onChange={handleInputChange}
								/>
							</div>
							<Button
								variant={'outline'}
								size={'sm'}
								onClick={() => handleProgressChange(5)}
								disabled={progress >= parseInt(book.pages, 10)}
								className='w-8 h-8'
							>
								<Plus style={{ width: '20px', height: '20px' }}></Plus>
							</Button>
						</div>
					</div>
				)}
			</CardFooter>
		</Card>
	)
}
