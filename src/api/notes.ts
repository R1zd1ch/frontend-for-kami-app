import { BACKEND_URL } from '@/lib/constants'
import { Note } from '@/lib/types'

export const getAllNotes = async (id: string, token: string) => {
	const response = await fetch(`${BACKEND_URL}/notes/${id}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to fetch notes')
	}
	const data = await response.json()
	return data
}

export const getNote = async (id: string, noteId: string, token: string) => {
	const response = await fetch(`${BACKEND_URL}/notes/${id}/${noteId}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to fetch note')
	}
	const data = await response.json()
	return data
}

export const createNote = async (
	id: string,
	note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>,
	token: string
) => {
	const response = await fetch(`${BACKEND_URL}/notes/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(note),
	})
	if (!response.ok) {
		throw new Error('Failed to create note')
	}
	const data = await response.json()
	return data
}

export const updateNote = async (
	id: string,
	noteId: string,
	note: Note,
	token: string
) => {
	const response = await fetch(`${BACKEND_URL}/notes/${id}/${noteId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			title: note.title,
			content: note.content,
			category: note.category,
			tags: note.tags,
			isPinned: note.isPinned,
		}),
	})
	if (!response.ok) {
		throw new Error('Failed to update note')
	}
	const data = await response.json()
	return data
}

export const deleteNote = async (id: string, noteId: string, token: string) => {
	const response = await fetch(`${BACKEND_URL}/notes/${id}/${noteId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to delete note')
	}
	const data = await response.json()
	return data
}
