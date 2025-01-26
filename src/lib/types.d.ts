export interface UserProfile {
	id: string
	email: string
	username: string
	firstName?: string
	lastName?: string
	gender?: string
	partnerId?: string
	bio?: string
	password: string
	avatarUrl?: string
	createdAt: Date
	updatedAt: Date
}

export interface UserProfileStore {
	profile: UserProfile | null
	loading: boolean
	fetchProfile: (id: string) => Promise<void>
	updateProfile: (id: string, data: Partial<UserProfile>) => Promise<void>
	deleteProfile: (id: string) => Promise<void>
	setProfile: (profile: UserProfile) => void
}

export interface Task {
	id: string
	title: string
	description: string
	importance: string
	selectDay: string
	subject: string
	dueDate: string
	isCompleted: boolean
	createdAt: string
	updatedAt: string
	userId?: string
}

export interface Note {
	id: string
	title: string
	content: string
	category?: string | null
	tags?: string | null
	isPinned: boolean
	createdAt: Date
	updatedAt: Date
	userId: string
}

export interface Mood {
	[x: string]: string | number | Date
	id: string
	date: Date
	moodLevel: number
	note?: string
	createdAt: Date
	userId: string
}

export interface MoodSummary {
	userId: string
	startDate?: string
	endDate?: string
	averageWeek?: number
	averageMonth?: number
	averageYear?: number
	averageDay?: number
	year?: number
	month?: number
}

export type DayAverageMood = {
	date: string
	average: number
}

export type WeekAverageMood = {
	start: Date
	end: Date
	days: DayAverageMood[]
}

export type MonthAverageMood = {
	start: Date
	end: Date
	days: DayAverageMood[]
}

export type YearAverageMood = {
	start: Date
	end: Date
	days: DayAverageMood[]
}

export type BookStatus = 'to-read' | 'reading' | 'completed'

export interface Book {
	externalId: string
	id: string
	status: BookStatus
	progress: number
	startDate?: string
	endDate?: string
	rating?: number
	review?: string
	isFavourite: boolean

	title: string
	authors: string[]
	coverUrl?: string
	description?: string
	publishedDate?: string
	pages: string
	categories?: string[]
	language?: string
	isbn?: string

	userId: string
	createdAt: Date
	updatedAt: Date
}

export interface SearchResult {
	id: string
	externalId: string
	title: string
	authors: string[]
	coverUrl?: string
	description?: string
	publishedDate?: string
	isbn?: string
	pages?: string
	categories?: string[]
	language?: string
}
