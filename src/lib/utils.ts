import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import imageCompression from 'browser-image-compression'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const generateHref = (name: string, id?: string) => {
	return id ? `/${name}/${id}` : `/${name}`
}

export const compressImage = async (file: File) => {
	try {
		const options = {
			maxSizeMB: 1,
			useWebWorker: true,
			maxWidthOrHeight: 800,
		}
		const compressedImage = await imageCompression(file, {
			fileType: 'image/jpeg',
			...options,
		})

		return compressedImage
	} catch (error) {
		console.error('Error compressing image:', error)
	}
}
