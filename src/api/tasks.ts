'use server'
import api from './serverApi'
import { Task } from '@/lib/types'

export const getTasks = async (id: string) => {
	try {
		const response = await api.get(`/tasks/${id}`)
		return response.data
	} catch (error) {
		console.error('Failed to fetch tasks:', error)
		throw error
	}
}

export const createTask = async (
	id: string,
	data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'isCompleted'>
) => {
	try {
		const response = await api.post(`/tasks/${id}`, data)
		return response.data
	} catch (error) {
		console.error('Failed to create task:', error)
		throw error
	}
}

export const updateTask = async (
	id: string,
	taskId: string,
	data: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
) => {
	try {
		const response = await api.put(`/tasks/${id}/${taskId}`, data)
		return response.data
	} catch (error) {
		console.error('Failed to update task:', error)
		throw error
	}
}

export const deleteTask = async (id: string, taskId: string) => {
	try {
		const response = await api.delete(`/tasks/${id}/${taskId}`)
		return response.data
	} catch (error) {
		console.error('Failed to delete task:', error)
		throw error
	}
}

export const getTasksLength = async (id: string) => {
	try {
		const response = await api.get(`/tasks/length/${id}`)
		return response.data
	} catch (error) {
		console.error('Failed to fetch tasks length:', error)
		throw error
	}
}
