/* eslint-disable @typescript-eslint/no-explicit-any */
import { format, parseISO, isValid } from 'date-fns'

export function formatDate(dateString: string, formatString: string): string {
	if (!dateString) return 'Invalid date'
	const parsedDate = parseISO(dateString)
	if (!isValid(parsedDate)) return 'Invalid date'
	return format(parsedDate, formatString)
}

export function getGradientColor(value: number): string {
	const hue = ((1 - value / 100) * 120).toString(10)
	return `hsl(${hue}, var(--chart-1-s), var(--chart-1-l))`
}
