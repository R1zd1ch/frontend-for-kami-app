'use server'
import serverApi from './serverApi'
import { Book, SearchResult } from '@/lib/types'

// Поиск книг через Google Books API
export async function searchBooks(
	query: string,
	limit: number = 40
): Promise<SearchResult[]> {
	try {
		const response = await serverApi.get(
			`/books/search?query=${encodeURIComponent(query)}&limit=${limit}`
		)
		return response.data
	} catch (error) {
		console.error('Failed to search books:', error)
		throw new Error('Failed to search books')
	}
}

// Получение всех книг пользователя
export async function getAllBooks(userId: string): Promise<Book[]> {
	try {
		const response = await serverApi.get(`/books/${userId}`)
		return response.data
	} catch (error) {
		console.error('Failed to fetch books:', error)
		throw new Error(
			'Failed to fetch books: ' +
				(error instanceof Error ? error.message : 'Unknown error')
		)
	}
}

// Получение конкретной книги
export async function getBook(userId: string, bookId: string): Promise<Book> {
	try {
		const response = await serverApi.get(`/books/${userId}/${bookId}`)
		return response.data
	} catch (error) {
		console.error('Failed to fetch book:', error)
		throw new Error('Failed to fetch book')
	}
}

// Создание новой книги
export async function createBook(
	userId: string,
	book: SearchResult
): Promise<Book> {
	try {
		const response = await serverApi.post(`/books/${userId}`, {
			externalId: book.externalId,
			title: book.title,
			authors: book.authors,
			coverUrl: book.coverUrl,
			description: book.description,
			publishedDate: book.publishedDate,
			isbn: book.isbn,
			isFavourite: false,
			pages: book.pages,
			categories: book.categories,
			status: 'to-read',
		})
		// console.log(response.data)
		return response.data
	} catch (error) {
		console.error('Failed to create book:', error)
		throw new Error('Failed to create book')
	}
}

// Обновление книги
export async function updateBook(userId: string, bookId: string, book: Book) {
	try {
		const response = await serverApi.put(`/books/${userId}/${bookId}`, {
			status: book.status,
			progress: book.progress,
			rating: book.rating,
			review: book.review,
			isFavourite: book.isFavourite ? true : false,
		})
		return response.data
	} catch (error) {
		console.error('Failed to update book:', error)
		throw new Error('Failed to update book')
	}
}

// Удаление книги
export async function deleteBook(userId: string, bookId: string) {
	try {
		const response = await serverApi.delete(`/books/${userId}/${bookId}`)
		return response.data
	} catch (error) {
		console.error('Failed to delete book:', error)
		throw new Error('Failed to delete book')
	}
}

// Добавление в избранное
export async function addToFavourites(userId: string, bookId: string) {
	try {
		const response = await serverApi.put(
			`/books/${userId}/${bookId}/favourites`
		)
		return response.data
	} catch (error) {
		console.error('Failed to add to favourites:', error)
		throw new Error('Failed to add to favourites')
	}
}

// Удаление из избранного
export async function removeFromFavourites(userId: string, bookId: string) {
	try {
		const response = await serverApi.put(
			`/books/${userId}/${bookId}/unfavourites`
		)
		return response.data
	} catch (error) {
		console.error('Failed to remove from favourites:', error)
		throw new Error('Failed to remove from favourites')
	}
}
