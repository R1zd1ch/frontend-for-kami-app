import { BACKEND_URL } from '@/lib/constants'
import { Mood, MoodSummary } from '@/lib/types'

export async function getAllMoods(id: string, token: string): Promise<Mood> {
	const response = await fetch(`${BACKEND_URL}/mood/${id}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getMoodsByDay(
	id: string,
	start: Date,
	end: Date,
	token: string
): Promise<Mood> {
	const response = await fetch(
		`${BACKEND_URL}/mood/by-day/${id}/${start}/${end}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	)
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getMoodsByCurrentDay(
	id: string,
	token: string
): Promise<Mood> {
	const response = await fetch(`${BACKEND_URL}/mood/by-current-day/${id}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getMoodsByWeek(
	id: string,
	start: Date,
	end: Date,
	token: string
): Promise<Mood> {
	const response = await fetch(
		`${BACKEND_URL}/mood/by-week/${id}/${start}/${end}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	)
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getMoodsByCurrentWeek(
	id: string,
	token: string
): Promise<Mood> {
	const response = await fetch(`${BACKEND_URL}/mood/by-current-week/${id}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getMoodsByMonth(
	id: string,
	start: Date,
	end: Date,
	token: string
): Promise<Mood> {
	const response = await fetch(
		`${BACKEND_URL}/mood/by-month/${id}/${start}/${end}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	)
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getMoodsByCurrentMonth(
	id: string,
	token: string
): Promise<Mood> {
	const response = await fetch(`${BACKEND_URL}/mood/by-current-month/${id}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getMood(
	id: string,
	moodId: string,
	token: string
): Promise<Mood> {
	const response = await fetch(`${BACKEND_URL}/mood/${id}/${moodId}`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function createMood(
	id: string,
	data: Omit<Mood, 'id' | 'createdAt' | 'userId'>,
	token: string
): Promise<Mood> {
	const response = await fetch(`${BACKEND_URL}/mood/${id}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
	if (!response.ok) {
		throw new Error('Failed to create mood')
	}
	const res = await response.json()
	return res as Mood
}

export async function updateMood(
	id: string,
	moodId: string,
	data: Omit<Mood, 'id' | 'createdAt' | 'userId'>,
	token: string
): Promise<Mood> {
	const response = await fetch(`${BACKEND_URL}/mood/${id}/${moodId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	})
	if (!response.ok) {
		throw new Error('Failed to update mood')
	}
	const res = await response.json()
	return res as Mood
}

export async function deleteMood(
	id: string,
	moodId: string,
	token: string
): Promise<Mood> {
	const response = await fetch(`${BACKEND_URL}/mood/${id}/${moodId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!response.ok) {
		throw new Error('Failed to delete mood')
	}
	const res = await response.json()
	return res
}

export async function getSummaryMoodByDay(
	id: string,
	start: Date,
	end: Date,
	token: string
): Promise<MoodSummary> {
	const response = await fetch(
		`${BACKEND_URL}/mood/mood-summary/by-day/${id}/${start}/${end}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	)
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getSummaryMoodByCurrentDay(
	id: string,
	token: string
): Promise<MoodSummary> {
	const response = await fetch(
		`${BACKEND_URL}/mood/mood-summary/by-current-day/${id}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	)
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getSummaryMoodByWeek(
	id: string,
	start: Date,
	end: Date,
	token: string
): Promise<MoodSummary> {
	const response = await fetch(
		`${BACKEND_URL}/mood/mood-summary/by-week/${id}/${start}/${end}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	)
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getSummaryMoodByCurrentWeek(
	id: string,
	token: string
): Promise<MoodSummary> {
	const response = await fetch(
		`${BACKEND_URL}/mood/mood-summary/by-current-week/${id}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	)
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getSummaryMoodByMonth(
	id: string,
	start: Date,
	end: Date,
	token: string
): Promise<MoodSummary> {
	const response = await fetch(
		`${BACKEND_URL}/mood/mood-summary/by-month/${id}/${start}/${end}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	)
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getSummaryMoodByCurrentMonth(
	id: string,
	token: string
): Promise<MoodSummary> {
	const response = await fetch(
		`${BACKEND_URL}/mood/mood-summary/by-current-month/${id}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	)
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}

export async function getSummaryMoodByYear(
	id: string,
	year: number,
	token: string
) {
	const response = await fetch(
		`${BACKEND_URL}/mood/mood-summary/by-year/${id}/${year}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		}
	)
	if (!response.ok) {
		throw new Error('Failed to fetch mood')
	}
	const data = await response.json()
	return data
}
