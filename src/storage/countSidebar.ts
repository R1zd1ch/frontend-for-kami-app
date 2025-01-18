import { getSidebarStatus } from '@/api/sidebar-status'
import { create } from 'zustand'

interface SidebarState {
	itemLengths: Record<string, number | null>
	setItemLength: (label: string, length: number | null) => void
	getItemLength: (label: string) => number | null
	incrementItemLength: (label: string) => void
	decrementItemLength: (label: string) => void
	loadItemsFromBackend: (id: string) => Promise<void>
}

const useSidebarStore = create<SidebarState>((set, get) => ({
	itemLengths: {
		Задачи: 0,
		Заметки: 0,
	},

	setItemLength: (label, length) =>
		set(state => ({
			itemLengths: {
				...state.itemLengths,
				[label]: length,
			},
		})),

	getItemLength: label => get().itemLengths[label] ?? null,

	incrementItemLength: label =>
		set(state => ({
			itemLengths: {
				...state.itemLengths,
				[label]: (state.itemLengths[label] ?? 0) + 1,
			},
		})),

	decrementItemLength: label =>
		set(state => ({
			itemLengths: {
				...state.itemLengths,
				[label]: Math.max((state.itemLengths[label] ?? 1) - 1, 0),
			},
		})),

	loadItemsFromBackend: async id => {
		try {
			const data = await getSidebarStatus(id)

			set(() => ({
				itemLengths: data,
			}))
		} catch (error) {
			console.error('Failed to load sidebar data:', error)
		}
	},
}))

export default useSidebarStore
