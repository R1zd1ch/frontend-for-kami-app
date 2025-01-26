'use server'

import serverApi from './serverApi'
import { Mood, MoodSummary } from '@/lib/types'

// Получение всех настроений
export async function getAllMoods(id: string): Promise<Mood> {
	const response = await serverApi.get(`/mood/${id}`)
	return response.data
}

export async function getAverageMoodByInterval(
	id: string,
	start: string,
	end: string,
	interval: 'day' | 'week' | 'month' | 'year'
) {
	const response = await serverApi.get(
		`/mood/mood-summary/by-interval/${id}/${start}/${end}/${interval}`
	)

	return response.data
}

// Получение настроений за день (диапазон дат)
export async function getMoodsByDay(
	id: string,
	start: string,
	end: string
): Promise<Mood[]> {
	const response = await serverApi.get(`/mood/by-day/${id}/${start}/${end}`)
	return response.data
}

// Получение настроений за текущий день
export async function getMoodsByCurrentDay(id: string): Promise<Mood> {
	const response = await serverApi.get(`/mood/by-current-day/${id}`)
	return response.data
}

// Получение настроений за неделю (диапазон дат)
export async function getMoodsByWeek(
	id: string,
	start: Date,
	end: Date
): Promise<Mood> {
	const response = await serverApi.get(
		`/mood/by-week/${id}/${start.toISOString()}/${end.toISOString()}`
	)
	return response.data
}

// Получение настроений за текущую неделю
export async function getMoodsByCurrentWeek(id: string): Promise<Mood> {
	const response = await serverApi.get(`/mood/by-current-week/${id}`)
	return response.data
}

// Получение настроений за месяц (диапазон дат)
export async function getMoodsByMonth(
	id: string,
	start: Date,
	end: Date
): Promise<Mood> {
	const response = await serverApi.get(
		`/mood/by-month/${id}/${start.toISOString()}/${end.toISOString()}`
	)
	return response.data
}

// Получение настроений за текущий месяц
export async function getMoodsByCurrentMonth(id: string): Promise<Mood> {
	const response = await serverApi.get(`/mood/by-current-month/${id}`)
	return response.data
}

// Получение конкретного настроения по ID
export async function getMood(id: string, moodId: string): Promise<Mood> {
	const response = await serverApi.get(`/mood/${id}/${moodId}`)
	return response.data
}

// Создание нового настроения
export async function createMood(
	id: string,
	data: Omit<Mood, 'id' | 'createdAt' | 'userId'>
): Promise<Mood> {
	const response = await serverApi.post(`/mood/${id}`, data)
	return response.data
}

// Обновление существующего настроения
export async function updateMood(
	id: string,
	moodId: string,
	data: Omit<Mood, 'id' | 'createdAt' | 'userId'>
): Promise<Mood> {
	const response = await serverApi.put(`/mood/${id}/${moodId}`, data)
	return response.data
}

// Удаление настроения
export async function deleteMood(id: string, moodId: string): Promise<Mood> {
	const response = await serverApi.delete(`/mood/${id}/${moodId}`)
	return response.data
}

// Получение сводки настроений за день (диапазон дат)
export async function getSummaryMoodByDay(
	id: string,
	start: Date,
	end: Date
): Promise<MoodSummary> {
	const response = await serverApi.get(
		`/mood/mood-summary/by-day/${id}/${start.toISOString()}/${end.toISOString()}`
	)
	return response.data
}

// Получение сводки настроений за текущий день
export async function getSummaryMoodByCurrentDay(
	id: string
): Promise<MoodSummary> {
	const response = await serverApi.get(
		`/mood/mood-summary/by-current-day/${id}`
	)
	return response.data
}

// Получение сводки настроений за неделю (диапазон дат)
export async function getSummaryMoodByWeek(
	id: string,
	start: Date,
	end: Date
): Promise<MoodSummary> {
	const response = await serverApi.get(
		`/mood/mood-summary/by-week/${id}/${start.toISOString()}/${end.toISOString()}`
	)
	return response.data
}

// Получение сводки настроений за текущую неделю
export async function getSummaryMoodByCurrentWeek(
	id: string
): Promise<MoodSummary> {
	const response = await serverApi.get(
		`/mood/mood-summary/by-current-week/${id}`
	)
	return response.data
}

// Получение сводки настроений за месяц (диапазон дат)
export async function getSummaryMoodByMonth(
	id: string,
	start: Date,
	end: Date
): Promise<MoodSummary> {
	const response = await serverApi.get(
		`/mood/mood-summary/by-month/${id}/${start.toISOString()}/${end.toISOString()}`
	)
	return response.data
}

// Получение сводки настроений за текущий месяц
export async function getSummaryMoodByCurrentMonth(
	id: string
): Promise<MoodSummary> {
	const response = await serverApi.get(
		`/mood/mood-summary/by-current-month/${id}`
	)
	return response.data
}

// Получение сводки настроений за год
export async function getSummaryMoodByYear(
	id: string,
	year: number
): Promise<MoodSummary> {
	const response = await serverApi.get(
		`/mood/mood-summary/by-year/${id}/${year}`
	)
	return response.data
}

export async function getRecentCreatedMoods(id: string): Promise<Mood[]> {
	const response = await serverApi.get(`/mood/recent-created/${id}`)
	return response.data
}

export async function getRecentUpdatedMoods(id: string): Promise<Mood[]> {
	const response = await serverApi.get(`/mood/recent-updated/${id}`)
	return response.data
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getRecentMoods(id: string): Promise<any> {
	const response = await serverApi.get(`/mood/recent/${id}`)
	console.log('recent', response.data)
	return response.data
}
