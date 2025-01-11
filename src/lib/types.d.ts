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
	id: string
	date: Date
	moodLevel: number
	note?: string
	createdAt: Date
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
