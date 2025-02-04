'use client'

import {
	Dialog,
	DialogContent,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useGiftStore } from '@/storage/giftStore'
import { useRef, useState } from 'react'
import { uploadImageAction } from '../../api/serverApi'
import { compressImage } from '@/lib/utils'
import { UploadIcon } from 'lucide-react'

const convertCurrency = (value: number, currency: string) => {
	if (currency === 'USD') return value
	if (currency === 'EUR') return (value * 0.9).toFixed(2)
	if (currency === 'RUB') return (value / 0.01).toFixed(2)
}

const dataCurrency = {
	USD: 'долларах',
	EUR: 'евро',
	RUB: 'рублях',
}

const priorityOptions = ['low', 'medium', 'high'] as const

export default function GiftAddModal({
	isOpen,
	setIsOpen,
	id,
	viewCurrency,
}: {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
	id: string
	viewCurrency: string
}) {
	const { createGift } = useGiftStore()
	const [isLoading, setIsLoading] = useState(false)
	const [formData, setFormData] = useState({
		name: '',
		description: '',
		image: '',
		price: 0,
		priority: 'low',
		category: '',
		link: '',
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [selectedFile, setSelectedFile] = useState<File | null>()
	const [isDragging, setIsDragging] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.name.trim()) newErrors.name = 'Название обязательно'
		if (!formData.description.trim())
			newErrors.description = 'Описание обязательно'
		if (!formData.category.trim()) newErrors.category = 'Категория обязательна'

		if (formData.image && !isValidUrl(formData.image)) {
			newErrors.image = 'Введите корректную ссылку'
		}

		if (formData.link && !isValidUrl(formData.link)) {
			newErrors.link = 'Введите корректную ссылку'
		}

		const price = Number(formData.price)
		if (isNaN(price) || price < 0) {
			newErrors.price = 'Цена должна быть положительной'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const isValidUrl = (url: string) => {
		try {
			new URL(url)
			return true
		} catch {
			return false
		}
	}

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = await compressImage(e.target.files[0])
			setSelectedFile(file)
		}
	}

	const uploadImage = async () => {
		if (!selectedFile) return ''

		try {
			const formData = new FormData()
			formData.append('image', selectedFile)

			const response = await uploadImageAction(formData)
			return response.url
		} catch (error) {
			console.error('Failed to upload image:', error)
			throw new Error('Failed to upload image')
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return

		// console.log(formData, selectedFile)

		try {
			setIsLoading(true)
			const imageUrl = selectedFile ? await uploadImage() : undefined

			const price = Number(convertCurrency(formData.price, viewCurrency)) || 0
			await createGift(id, {
				...formData,
				price,
				image: imageUrl,
				link: formData.link || undefined,
			})
			setFormData({
				name: '',
				description: '',
				image: '',
				price: 0,
				priority: 'low',
				category: '',
				link: '',
			})
			setIsOpen(false)
		} catch (error) {
			console.error('Ошибка добавления желания:', error)
		} finally {
			setIsLoading(false)
		}
	}

	const handleChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }))
		setErrors(prev => ({ ...prev, [field]: '' }))
	}

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(true)
	}

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(true)
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
		const files = e.dataTransfer.files
		if (files.length > 0) {
			setSelectedFile(files[0])
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Добавить желание</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Добавить желание</DialogTitle>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<label>Название</label>
						<Input
							value={formData.name}
							onChange={e => handleChange('name', e.target.value)}
							placeholder='Введите название'
						/>
						{errors.name && (
							<p className='text-red-500 text-sm'>{errors.name}</p>
						)}
					</div>

					<div>
						<label>Описание</label>
						<Input
							value={formData.description}
							onChange={e => handleChange('description', e.target.value)}
							placeholder='Введите описание'
						/>
						{errors.description && (
							<p className='text-red-500 text-sm'>{errors.description}</p>
						)}
					</div>

					<div>
						<label>
							Цена в {dataCurrency[viewCurrency as keyof typeof dataCurrency]}
						</label>
						<div className='text-xs text-muted-foreground'>
							*Валюта зависит от выбранной вами в параметрах
						</div>
						<Input
							type='number'
							value={formData.price}
							onChange={e => handleChange('price', e.target.value)}
							placeholder='Введите цену'
						/>
						{errors.price && (
							<p className='text-red-500 text-sm'>{errors.price}</p>
						)}
					</div>

					<div>
						<label>Приоритет</label>
						<Select
							value={formData.priority}
							onValueChange={value => handleChange('priority', value)}
						>
							<SelectTrigger>
								<SelectValue placeholder='Выберите приоритет' />
							</SelectTrigger>
							<SelectContent>
								{priorityOptions.map(option => (
									<SelectItem key={option} value={option}>
										{
											{
												low: 'Низкий',
												medium: 'Средний',
												high: 'Высокий',
											}[option]
										}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div>
						<label>Категория</label>
						<Input
							value={formData.category}
							onChange={e => handleChange('category', e.target.value)}
							placeholder='Введите категорию'
						/>
						{errors.category && (
							<p className='text-red-500 text-sm'>{errors.category}</p>
						)}
					</div>

					<div>
						<label>Ссылка на вещь</label>
						<Input
							value={formData.link}
							onChange={e => handleChange('link', e.target.value)}
							placeholder='Введите ссылку'
						/>
						{errors.link && (
							<p className='text-red-500 text-sm'>{errors.link}</p>
						)}
					</div>

					<div>
						<label>Загрузить изображение</label>
						<div className='w-full mx-auto'>
							<div
								className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
        ${
					isDragging
						? 'border-blue-500 bg-blue-50'
						: 'border-gray-300 hover:border-gray-400'
				}
        ${errors.image ? 'border-red-500' : ''}`}
								onClick={() => fileInputRef.current?.click()}
								onDragEnter={handleDragEnter}
								onDragLeave={handleDragLeave}
								onDragOver={handleDragOver}
								onDrop={handleDrop}
							>
								<div className='flex flex-col items-center gap-2'>
									<UploadIcon className='w-8 h-8 text-gray-500' />
									<p className='text-sm text-gray-600'>
										{isDragging
											? 'Отпустите для загрузки'
											: 'Перетащите изображение сюда или кликните для выбора'}
									</p>
								</div>
								<input
									type='file'
									accept='image/*'
									onChange={handleFileChange}
									ref={fileInputRef}
									className='hidden'
								/>
							</div>
						</div>

						{selectedFile && (
							<div className='mt-4'>
								<p className='text-sm text-gray-600'>
									Выбран файл: {selectedFile.name}
									<button
										type='button'
										onClick={() => setSelectedFile(null)}
										className='ml-2 text-red-600 hover:text-red-700 text-sm'
									>
										(удалить)
									</button>
								</p>
							</div>
						)}

						{errors.image && (
							<p className='text-red-500 text-sm'>{errors.image}</p>
						)}
					</div>

					<Button type='submit' className='w-full' disabled={isLoading}>
						{isLoading ? 'Добавление...' : 'Добавить'}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	)
}
