'use client'
import { useState, useEffect, useRef } from 'react'
import { Gift } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { useGiftStore } from '@/storage/giftStore'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '../ui/dialog'
import { Loader2, Pencil, UploadCloud } from 'lucide-react'
import { compressImage } from '@/lib/utils'
import { uploadImageAction } from '@/api/serverApi'

const GiftEditModal = ({
	isOpen,
	setIsOpen,
	gift,
	userId,
}: {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
	gift: Gift
	userId: string
}) => {
	const { updateGift } = useGiftStore()
	const [formData, setFormData] = useState<Partial<Gift>>(gift)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isDragging, setIsDragging] = useState(false)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const fileInputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		setFormData(gift)
	}, [gift])

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

	const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
		const files = e.dataTransfer.files
		if (files.length > 0) {
			const file = await compressImage(files[0])
			setSelectedFile(file as File)
		}
	}

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = await compressImage(e.target.files[0])
			setSelectedFile(file as File)
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
		setIsSubmitting(true)
		e.preventDefault()
		try {
			const imageUrl = selectedFile ? await uploadImage() : gift.image || ''
			await updateGift(userId, gift.id, {
				...formData,
				image: imageUrl,
			})
			setIsOpen(false)
			setFormData(gift)
			setSelectedFile(null)
		} catch (error) {
			console.error('Error updating gift:', error)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div onClick={e => e.stopPropagation()}>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogTrigger asChild>
					<Button
						size='sm'
						className='bg-yellow-200 hover:bg-yellow-300'
						onClick={e => {
							e.stopPropagation()
							setIsOpen(true)
						}}
					>
						<Pencil className='w-4 h-4 text-yellow-700' />
					</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[600px]'>
					<DialogHeader>
						<DialogTitle>Редактировать подарок</DialogTitle>
						<DialogDescription>
							Внесите изменения в данные подарка
						</DialogDescription>
					</DialogHeader>

					<form onSubmit={handleSubmit} className='grid gap-4 py-4'>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='name' className='text-right'>
								Название
							</Label>
							<Input
								id='name'
								value={formData.name || ''}
								onChange={e =>
									setFormData({ ...formData, name: e.target.value })
								}
								className='col-span-3'
							/>
						</div>

						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='description' className='text-right'>
								Описание
							</Label>
							<Textarea
								id='description'
								value={formData.description || ''}
								onChange={e =>
									setFormData({ ...formData, description: e.target.value })
								}
								className='col-span-3'
							/>
						</div>

						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='price' className='text-right'>
								Цена ($)
							</Label>
							<Input
								id='price'
								type='number'
								value={formData.price || 0}
								onChange={e =>
									setFormData({ ...formData, price: Number(e.target.value) })
								}
								className='col-span-3'
							/>
						</div>

						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='category' className='text-right'>
								Категория
							</Label>
							<Input
								id='category'
								value={formData.category || ''}
								onChange={e =>
									setFormData({ ...formData, category: e.target.value })
								}
								className='col-span-3'
							/>
						</div>

						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='priority' className='text-right'>
								Приоритет
							</Label>
							<Select
								value={formData.priority || ''}
								onValueChange={value =>
									setFormData({ ...formData, priority: value })
								}
							>
								<SelectTrigger className='col-span-3'>
									<SelectValue placeholder='Выберите приоритет' />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='high'>Высокий</SelectItem>
									<SelectItem value='medium'>Средний</SelectItem>
									<SelectItem value='low'>Низкий</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='link' className='text-right'>
								Ссылка
							</Label>
							<Input
								id='link'
								type='url'
								value={formData.link || ''}
								onChange={e =>
									setFormData({ ...formData, link: e.target.value })
								}
								className='col-span-3'
							/>
						</div>

						<div className='grid grid-cols-4 items-center gap-4'>
							<Label className='text-right'>Изображение</Label>
							<div className='col-span-3 space-y-2'>
								<div
									className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
										isDragging
											? 'border-blue-500 bg-blue-50'
											: 'border-gray-300 hover:border-gray-400'
									}`}
									onClick={() => fileInputRef.current?.click()}
									onDragEnter={handleDragEnter}
									onDragLeave={handleDragLeave}
									onDragOver={handleDragOver}
									onDrop={handleDrop}
								>
									<div className='flex flex-col items-center gap-2'>
										<UploadCloud className='w-8 h-8 text-gray-500' />
										<p className='text-sm text-gray-600'>
											{isDragging
												? 'Отпустите для загрузки'
												: 'Перетащите изображение или кликните для выбора'}
										</p>
									</div>
								</div>
								<input
									type='file'
									accept='image/*'
									onChange={handleFileChange}
									ref={fileInputRef}
									className='hidden'
								/>

								{selectedFile && (
									<div className='text-sm text-gray-600'>
										Выбран файл: {selectedFile.name}
										<button
											type='button'
											onClick={() => setSelectedFile(null)}
											className='ml-2 text-red-600 hover:text-red-700'
										>
											(удалить)
										</button>
									</div>
								)}
							</div>
						</div>

						<div className='flex justify-end gap-2 mt-4'>
							<Button
								type='button'
								variant='outline'
								onClick={() => setIsOpen(false)}
							>
								Отмена
							</Button>
							<Button type='submit' disabled={isSubmitting} className='w-40'>
								{isSubmitting ? (
									<Loader2 className='h-4 w-4 animate-spin' />
								) : (
									'Сохранить изменения'
								)}
							</Button>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	)
}

export default GiftEditModal
