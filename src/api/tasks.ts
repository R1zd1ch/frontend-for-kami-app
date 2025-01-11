import { BACKEND_URL } from '@/lib/constants'
import { Task } from '@/lib/types'

export const getTasks = async (id: string, token: string) => {
	const response = await fetch(`${BACKEND_URL}/tasks/${id}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to fetch tasks')
	}
	const data = await response.json()
	return data
}

export const createTask = async (
	id: string,
	data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'isCompleted'>,
	token: string
) => {
	const response = await fetch(`${BACKEND_URL}/tasks/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
	if (!response.ok) {
		throw new Error('Failed to create task')
	}
	const res = await response.json()
	return res
}

export const updateTask = async (
	id: string,
	taskId: string,
	data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>,
	token: string
) => {
	const response = await fetch(`${BACKEND_URL}/tasks/${id}/${taskId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
	if (!response.ok) {
		throw new Error('Failed to update task')
	}
	const res = await response.json()
	return res
}

export const deleteTask = async (id: string, taskId: string, token: string) => {
	const response = await fetch(`${BACKEND_URL}/tasks/${id}/${taskId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to delete task')
	}
	const res = await response.json()

	return res
}

export const getTasksLength = async (id: string, token: string) => {
	const response = await fetch(`${BACKEND_URL}/tasks/length/${id}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to fetch tasks length')
	}
	const data = await response.json()
	return data
}
