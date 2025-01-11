import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const generateHref = (name: string, id?: string) => {
	return id ? `/${name}/${id}` : `/${name}`
}
