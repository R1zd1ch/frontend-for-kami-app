import { Badge } from '@/components/ui/badge'
import {
	CalendarDays,
	Star,
	Bookmark,
	BookOpen,
	Grid2X2,
	Languages,
	Check,
	Frown,
} from 'lucide-react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Book } from '@/lib/types'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Card } from '../ui/card'

const BookMoreInformation = ({ book }: { book: Book }) => {
	const getPublicationYear = () => {
		if (!book.publishedDate) return 'Неизвестно'
		const date = new Date(book.publishedDate)
		return isNaN(date.getTime()) ? book.publishedDate : date.getFullYear()
	}

	const formatCategories = (categories: string[] | undefined) => {
		if (!categories) return []
		return categories.map(cat =>
			cat.replace(/турсwriting/gi, 'Typewriting').trim()
		)
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size={'sm'} className='text-sm '>
					Подробнее
				</Button>
			</DialogTrigger>

			<DialogContent className='lg:max-w-4xl'>
				<DialogHeader className='flex flex-col w-full'>
					<DialogTitle className='text-xl'>{book.title}</DialogTitle>
					<div className='flex flex-row justify-between items-center text-sm '>
						<div>
							<DialogDescription>
								{book.authors.length > 0
									? book.authors.join(', ')
									: 'Авторы не указаны'}
							</DialogDescription>
							<DialogDescription className='flex flex-row gap-2'>
								Опубликовано: {getPublicationYear()}
							</DialogDescription>
						</div>
						<div>
							{book.categories && book.categories.length > 0 ? (
								<div className='flex flex-row flex-wrap max-w-60 items-center'>
									<div>
										{book.categories.length === 1
											? 'Категория: '
											: 'Категории: '}
									</div>
									{formatCategories(book.categories).map((category, index) => (
										<Badge key={index} className='m-1' variant='secondary'>
											{category}
										</Badge>
									))}
								</div>
							) : (
								<div>Категории не указаны</div>
							)}
						</div>
					</div>
				</DialogHeader>
				<div className='flex flex-col gap-4'>
					<div className='w-full flex flex-row gap-6'>
						<div className='overflow-hidden rounded-lg w-fit min-w-fit h-fit'>
							<Image
								src={book.coverUrl || '/placeholder.png'}
								alt={book.title}
								quality={100}
								width={150}
								height={150}
								className=' object-fill transition-transform duration-300 group-hover:scale-105 progressive border-primary border-2 rounded-lg'
								style={{
									filter: 'contrast(1.05) saturate(1.1) brightness(1.05)',
								}}
							/>
						</div>
						<Card className=' overflow-y-auto px-3 py-2  border-primary border-2 w-full max-h-[250px]'>
							{book.description ? (
								<div>{book.description}</div>
							) : (
								<div className='flex flex-row gap-2 items-center justify-center h-full'>
									<Frown className='w-8 h-8'></Frown>
									<p className='text-lg'>Описание отсутствует</p>
								</div>
							)}
						</Card>
					</div>
					<div className='flex flex-row justify-between items-center'>
						<div className='flex flex-row gap-2'>
							{book.pages && (
								<>
									<div className='flex flex-row gap-1 items-center text-sm'>
										<BookOpen className='w-4 h-4' />
										<div>{book.pages} стр.</div>
									</div>

									{book.progress > 0 &&
										(book.progress < parseInt(book.pages, 10) ? (
											<div className='flex flex-row gap-1 items-center text-sm'>
												<p>Прочитано:</p>
												<div>{book.progress} стр.</div>
											</div>
										) : (
											<div className='flex flex-row gap-1 items-center text-sm'>
												<p>Прочитано</p>
												<Check className='w-4 h-4 text-green-500'></Check>
											</div>
										))}
								</>
							)}
						</div>
						<div>
							<div className='flex flex-row gap-2'>
								<p>ISBN:</p>
								<div>
									{book.isbn && book.isbn.length > 0 ? (
										<Badge>{book.isbn}</Badge>
									) : (
										<Badge>Не указан</Badge>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default BookMoreInformation
