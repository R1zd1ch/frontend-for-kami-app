/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'
import { useBookStore } from '@/storage/bookStore'
import {
	Book as BookIcon,
	BookHeart,
	BookMarked,
	BookOpen,
	Library,
	Loader2,
	Search,
	AlertTriangle,
} from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { Input } from '../ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { searchBooks } from '@/api/books'
import Fuse from 'fuse.js'
import { Book } from '@/lib/types'
import { BookList } from './BookList'
import useSidebarStore from '@/storage/countSidebar'

interface BooksBoardProps {
	id: string
}

type TabType = 'catalog' | 'all' | 'favourites' | 'read'

const BooksBoard = ({ id }: BooksBoardProps) => {
	const { books, error, fetchBooks } = useBookStore()
	const [loadingCatalog, setLoadingCatalog] = useState(false)
	const [catalogError, setCatalogError] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<TabType>('catalog')

	const [catalogSearchTerm, setCatalogSearchTerm] = useState('')
	const [catalogResults, setCatalogResults] = useState<Book[]>([])

	const [userBooksSearchTerm, setUserBooksSearchTerm] = useState('')
	const [userBooksResults, setUserBooksResults] = useState<Book[]>([])
	const { getItemLength, incrementItemLength, decrementItemLength } =
		useSidebarStore()

	const fuse = useMemo(
		() =>
			new Fuse(books, {
				keys: ['title', 'authors', 'description'],
				threshold: 0.3,
				includeScore: true,
			}),
		[books]
	)

	useEffect(() => {
		const lengthSidebarState = getItemLength('Книги')
		const filteredBooks = books.filter(
			book =>
				book.status !== 'completed' && !book.isFavourite && book.progress > 0
		)
		// console.log(filteredBooks, lengthSidebarState)
		if (lengthSidebarState) {
			if (filteredBooks.length > lengthSidebarState) {
				incrementItemLength('Книги')
			}
			if (filteredBooks.length < lengthSidebarState) {
				decrementItemLength('Книги')
			}
		}
	}, [books])

	const filteredBooks = useMemo(() => {
		switch (activeTab) {
			case 'favourites':
				return books.filter(book => book.isFavourite)
			case 'read':
				return books.filter(book => book.status === 'completed')
			case 'all':
				return books.filter(book => book.status !== 'completed')
			default:
				return books
		}
	}, [books, activeTab])

	// Поиск в каталоге
	useEffect(() => {
		if (activeTab !== 'catalog') return

		const handler = setTimeout(async () => {
			const term = catalogSearchTerm.trim()
			if (term.length > 0) {
				setLoadingCatalog(true)
				try {
					const results = await searchBooks(term)
					setCatalogResults(results as Book[])
				} catch (error) {
					// console.log(error)
					setCatalogError('Something went wrong')
				} finally {
					setLoadingCatalog(false)
				}
			} else {
				setCatalogResults([])
			}
		}, 300)

		return () => clearTimeout(handler)
	}, [catalogSearchTerm, activeTab])

	// Поиск в пользовательских книгах
	useEffect(() => {
		if (activeTab === 'catalog') return

		const term = userBooksSearchTerm.trim()
		if (term) {
			const results = fuse.search(term)
			setUserBooksResults(results.map(r => r.item))
		} else {
			setUserBooksResults(filteredBooks)
		}
	}, [userBooksSearchTerm, activeTab, fuse, filteredBooks])

	useEffect(() => {
		fetchBooks(id)
	}, [id, fetchBooks])

	const handleSearchChange = (value: string) => {
		if (activeTab === 'catalog') {
			setCatalogSearchTerm(value)
		} else {
			setUserBooksSearchTerm(value)
		}
	}

	const currentSearchTerm =
		activeTab === 'catalog' ? catalogSearchTerm : userBooksSearchTerm

	const filterSearchResults = (results: Book[]) => {
		switch (activeTab) {
			case 'favourites':
				return results.filter(book => book.isFavourite)
			case 'read':
				return results.filter(book => book.status === 'completed')
			case 'all':
				return results.filter(book => book.status !== 'completed')
			default:
				return results
		}
	}

	const getDisplayBooks = () => {
		if (activeTab === 'catalog') return catalogResults
		return userBooksSearchTerm
			? filterSearchResults(userBooksResults)
			: filteredBooks
	}

	return (
		<div className='container mx-auto space-y-6'>
			<div className='flex flex-col md:flex-row justify-between items-start gap-4'>
				<div className='flex flex-col flex-1'>
					<div className='flex items-center gap-2 mb-2'>
						<BookIcon className='h-8 w-8' />
						<h1 className='text-3xl font-bold'>Трекер книг</h1>
					</div>
					<p className='text-muted-foreground text-sm'>
						Управляйте своими книгами, находите новые произведения и
						отслеживайте прогресс чтения
					</p>
				</div>

				<div className='w-full md:max-w-sm'>
					<div className='flex items-center rounded-lg border border-primary bg-muted px-3.5 py-2'>
						<Search className='w-6 h-6 mr-2' />
						<Input
							placeholder='Поиск книг...'
							value={currentSearchTerm}
							onChange={e => handleSearchChange(e.target.value)}
							className='border-none bg-transparent focus-visible:ring-0'
						/>
					</div>
				</div>
			</div>

			<Tabs
				value={activeTab}
				onValueChange={value => {
					setActiveTab(value as TabType)
				}}
			>
				<TabsList className='grid w-full grid-cols-4 gap-2 mb-4'>
					<TabsTrigger value='catalog'>
						<Library className='mr-2 h-4 w-4' />
						Каталог
					</TabsTrigger>
					<TabsTrigger value='all'>
						<BookMarked className='mr-2 h-4 w-4' />К чтению (
						{books.filter(b => b.status !== 'completed').length})
					</TabsTrigger>
					<TabsTrigger value='favourites'>
						<BookHeart className='mr-2 h-4 w-4' />
						Понравившиеся ({books.filter(b => b.isFavourite).length})
					</TabsTrigger>
					<TabsTrigger value='read'>
						<BookOpen className='mr-2 h-4 w-4' />
						Прочитанные ({books.filter(b => b.status === 'completed').length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value='catalog'>
					{catalogError ? (
						<div className='flex items-center justify-center h-32'>
							<AlertTriangle className='mr-2 h-6 w-6' />
							<span className='text-muted-foreground'>{catalogError}</span>
						</div>
					) : loadingCatalog ? (
						<div className='flex items-center justify-center h-32'>
							<Loader2 className='mr-2 h-6 w-6 animate-spin' />
							<span className='text-muted-foreground'>Поиск в каталоге...</span>
						</div>
					) : (
						<BookList
							books={catalogResults}
							isCatalog={true}
							userId={id}
							isFavouritePage={false}
							catalogSearchTerm={catalogSearchTerm}
						/>
					)}
				</TabsContent>

				{(['all', 'favourites', 'read'] as TabType[]).map(tab => (
					<TabsContent key={tab} value={tab}>
						{error ? (
							<div className='flex items-center justify-center h-32'>
								<AlertTriangle className='mr-2 h-6 w-6' />
								<span className='text-muted-foreground'>{error}</span>
							</div>
						) : false ? (
							<div className='flex items-center justify-center h-32'>
								<Loader2 className='mr-2 h-6 w-6 animate-spin' />
								<span className='text-muted-foreground'>
									Поиск в пользовательской коллекции...
								</span>
							</div>
						) : (
							<BookList
								books={getDisplayBooks()}
								isCatalog={false}
								isFavouritePage={tab === 'favourites'}
								userId={id}
								userSearchTerm={userBooksSearchTerm}

								// userId={''}
							/>
						)}
					</TabsContent>
				))}
			</Tabs>
		</div>
	)
}

export default BooksBoard
