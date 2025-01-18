// import { BACKEND_URL } from '@/lib/constants'
// import { Note } from '@/lib/types'

// export const getAllNotes = async (id: string, token: string) => {
// 	const response = await fetch(`${BACKEND_URL}/notes/${id}`, {
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Authorization: `Bearer ${token}`,
// 		},
// 	})
// 	if (!response.ok) {
// 		throw new Error('Failed to fetch notes')
// 	}
// 	const data = await response.json()
// 	return data
// }

// export const getNote = async (id: string, noteId: string, token: string) => {
// 	const response = await fetch(`${BACKEND_URL}/notes/${id}/${noteId}`, {
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Authorization: `Bearer ${token}`,
// 		},
// 	})
// 	if (!response.ok) {
// 		throw new Error('Failed to fetch note')
// 	}
// 	const data = await response.json()
// 	return data
// }

// export const createNote = async (
// 	id: string,
// 	note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
// 	token: string
// ) => {
// 	const response = await fetch(`${BACKEND_URL}/notes/${id}`, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Authorization: `Bearer ${token}`,
// 		},
// 		body: JSON.stringify(note),
// 	})
// 	if (!response.ok) {
// 		throw new Error('Failed to create note')
// 	}
// 	const data = await response.json()
// 	return data
// }

// export const updateNote = async (
// 	id: string,
// 	noteId: string,
// 	note: Note,
// 	token: string
// ) => {
// 	const response = await fetch(`${BACKEND_URL}/notes/${id}/${noteId}`, {
// 		method: 'PUT',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Authorization: `Bearer ${token}`,
// 		},
// 		body: JSON.stringify({
// 			title: note.title,
// 			content: note.content,
// 			category: note.category,
// 			tags: note.tags,
// 			isPinned: note.isPinned,
// 		}),
// 	})
// 	if (!response.ok) {
// 		throw new Error('Failed to update note')
// 	}
// 	const data = await response.json()
// 	return data
// }

// export const deleteNote = async (id: string, noteId: string, token: string) => {
// 	const response = await fetch(`${BACKEND_URL}/notes/${id}/${noteId}`, {
// 		method: 'DELETE',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			Authorization: `Bearer ${token}`,
// 		},
// 	})
// 	if (!response.ok) {
// 		throw new Error('Failed to delete note')
// 	}
// 	const data = await response.json()
// 	return data
// }

import serverApi from './serverApi'
import { Note } from '@/lib/types'

export async function getAllNotes(id: string): Promise<Note[]> {
	try {
		const response = await serverApi.get(`/notes/${id}`)
		return response.data
	} catch (error) {
		console.error('Failed to fetch notes:', error)
		throw new Error('Failed to fetch notes')
	}
}

export async function getNote(id: string, noteId: string): Promise<Note> {
	try {
		const response = await serverApi.get(`/notes/${id}/${noteId}`)
		return response.data
	} catch (error) {
		console.error('Failed to fetch note:', error)
		throw new Error('Failed to fetch note')
	}
}

export async function createNote(
	id: string,
	note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<Note> {
	try {
		const response = await serverApi.post(`/notes/${id}`, note)
		return response.data
	} catch (error) {
		console.error('Failed to create note:', error)
		throw new Error('Failed to create note')
	}
}

export async function updateNote(id: string, noteId: string, note: Note) {
	try {
		const response = await serverApi.put(`/notes/${id}/${noteId}`, {
			title: note.title,
			content: note.content,
			category: note.category,
			tags: note.tags,
			isPinned: note.isPinned,
		})
		return response.data
	} catch (error) {
		console.error('Failed to update note:', error)
		throw new Error('Failed to update note')
	}
}

export async function deleteNote(id: string, noteId: string) {
	try {
		const response = await serverApi.delete(`/notes/${id}/${noteId}`)
		return response.data
	} catch (error) {
		console.error('Failed to delete note:', error)
		throw new Error('Failed to delete note')
	}
}
