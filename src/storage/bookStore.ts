'use client'
import { create } from 'zustand'
import { Book } from '../lib/types'
import {
	getAllBooks,
	createBook as apiCreateBook,
	updateBook as apiUpdateBook,
	deleteBook as apiDeleteBook,
	addToFavourites,
	removeFromFavourites,
} from '../api/books'

type BookStoreState = {
	books: Book[]
	loading: boolean
	error: string | null
}

type BookStoreActions = {
	fetchBooks: (userId: string) => Promise<void>
	addBook: (
		userId: string,
		book: Omit<Book, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
	) => Promise<Book | void>
	updateBook: (
		userId: string,
		bookId: string,
		updates: Partial<Book>
	) => Promise<void>
	deleteBook: (userId: string, bookId: string) => Promise<void>
	toggleFavourite: (
		userId: string,
		bookId: string,
		isFavourite: boolean
	) => Promise<void>

	toggleFavouriteFromCatalog: (userId: string, book: Book) => Promise<void>
}

type BookStore = BookStoreState & BookStoreActions

export const useBookStore = create<BookStore>((set, get) => ({
	books: [],
	loading: false,
	error: null,
	addDisabled: false,
	deleteDisabled: false,
	updateDisabled: false,
	favouritesDisabled: false,

	fetchBooks: async userId => {
		// Отмена предыдущего запроса

		try {
			const books = await getAllBooks(userId)
			set({ books, loading: false })
		} catch (error) {
			if ((error as Error).name !== 'AbortError') {
				set({
					error:
						error instanceof Error ? error.message : 'Failed to fetch books',
					loading: false,
				})
			}
		}
	},

	addBook: async (userId, bookData) => {
		const tempId = `temp-${Date.now()}`
		// Оптимистичное обновление
		set(state => ({
			books: [
				...state.books,
				{
					...bookData,
					id: tempId,
					userId,
					createdAt: new Date(),
					updatedAt: new Date(),
					isFavourite: false,
				} as Book,
			],
			loading: true,
		}))

		try {
			const newBook = await apiCreateBook(userId, bookData as Book)
			set(state => ({
				books: state.books.map(book => (book.id === tempId ? newBook : book)),
				loading: false,
			}))

			return newBook
		} catch (error) {
			// Откат изменений при ошибке
			set(state => ({
				books: state.books.filter(book => book.id !== tempId),
				error: error instanceof Error ? error.message : 'Failed to add book',
				loading: false,
			}))
		}
	},

	updateBook: async (userId, bookId, updates) => {
		const originalBooks = get().books
		// Оптимистичное обновление
		set(state => ({
			books: state.books.map(book =>
				book.id === bookId ? { ...book, ...updates } : book
			),
			loading: true,
		}))

		try {
			await apiUpdateBook(userId, bookId, updates as Book)
			set({ loading: false })
		} catch (error) {
			// Откат изменений при ошибке
			set({
				books: originalBooks,
				error: error instanceof Error ? error.message : 'Failed to update book',
				loading: false,
			})
		}
	},

	deleteBook: async (userId, bookId) => {
		const originalBooks = get().books
		// Оптимистичное обновление
		set(state => ({
			books: state.books.filter(book => book.id !== bookId),
			loading: true,
		}))

		try {
			await apiDeleteBook(userId, bookId)
			set({ loading: false })
		} catch (error) {
			// Откат изменений при ошибке
			set({
				books: originalBooks,
				error: error instanceof Error ? error.message : 'Failed to delete book',
				loading: false,
			})
		}
	},

	toggleFavourite: async (userId, bookId, isFavourite) => {
		const originalBooks = get().books
		// Оптимистичное обновление
		set(state => ({
			books: state.books.map(book =>
				book.id === bookId ? { ...book, isFavourite: !isFavourite } : book
			),
			loading: true,
		}))

		try {
			if (isFavourite) {
				await removeFromFavourites(userId, bookId)
			} else {
				await addToFavourites(userId, bookId)
			}
			set({ loading: false })
		} catch (error) {
			// Откат изменений при ошибке
			set({
				books: originalBooks,
				error:
					error instanceof Error ? error.message : 'Failed to toggle favourite',
				loading: false,
			})
		}
	},

	toggleFavouriteFromCatalog: async (userId, catalogBook) => {
		const originalBooks = get().books
		const tempId = `temp-${Date.now()}`

		try {
			// 1. Оптимистичное добавление книги
			const tempBook: Book = {
				...catalogBook,
				id: tempId,
				userId,
				isFavourite: true,
				status: 'to-read',
				progress: 0,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			set(state => ({
				books: [...state.books, tempBook],
				loading: true,
			}))

			// 2. Последовательные запросы к API
			const { id } = await apiCreateBook(userId, {
				...catalogBook,
			})
			// console.log('Book created', id)

			const favouriteBook = await addToFavourites(userId, id)

			// console.log('Book added to favourites', favouriteBook)

			set(state => ({
				books: state.books.map(book =>
					book.id === tempId ? favouriteBook : book
				),
				loading: false,
			}))

			// 3. Обновление состояния с реальными данными
		} catch (error) {
			// 4. Откат изменений при ошибке
			set({
				books: originalBooks,
				error:
					error instanceof Error
						? error.message
						: 'Failed to add to favourites',
				loading: false,
			})
			throw error
		}
	},
}))

// Мемоизированные селекторы
export const useFavouriteBooks = () => {
	return useBookStore(state => state.books.filter(book => book.isFavourite))
}

export const useBooksByStatus = (status: Book['status']) => {
	return useBookStore(state =>
		state.books.filter(book => book.status === status)
	)
}
