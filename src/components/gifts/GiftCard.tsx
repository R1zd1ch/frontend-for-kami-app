'use client'
import { Gift } from '@/lib/types'
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardFooter,
} from '../ui/card'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import {
	ArrowUpRight,
	Check,
	GiftIcon,
	Loader2,
	Pencil,
	Trash,
} from 'lucide-react'
import Image from 'next/image'
import { format } from 'date-fns'
import { useState } from 'react'
import CardModalInfo from './CardModalInfo'
import { useGiftStore } from '@/storage/giftStore'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import GiftEditModal from './GiftEditModal'

interface GiftCardProps {
	gift: Gift
	viewCurrency: string
}

export const getCurrency = (price: number, viewCurrency: string) => {
	if (viewCurrency === 'EUR') return (price * 0.9).toFixed(2)
	if (viewCurrency === 'RUB') return (price / 0.01).toFixed(2)
	return price.toFixed(2)
}

export const getSymbol = (currency: string) => {
	if (currency === 'EUR') return '€'
	if (currency === 'RUB') return '₽'
	return '$'
}

export const getPriorityStyle = (priority: string) => {
	switch (priority) {
		case 'high':
			return 'bg-red-100 text-red-800 hover:bg-red-200'
		case 'medium':
			return 'bg-amber-100 text-amber-800 hover:bg-amber-200'
		default:
			return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
	}
}

const GiftCard = ({ gift, viewCurrency }: GiftCardProps) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const { deleteGift, updateGift } = useGiftStore()
	const [isDeleting, setIsDeleting] = useState(false)
	const [isReceiving, setIsReceiving] = useState(false)
	const [isEditing, setIsEditing] = useState(false)

	const handleDelete = async () => {
		setIsDeleting(true)
		try {
			await deleteGift(gift.userId, gift.id)
		} catch (error) {
			// console.log(error)
		} finally {
			setIsDeleting(false)
		}
	}

	const handleReceived = async () => {
		setIsReceiving(true)
		try {
			await updateGift(gift.userId, gift.id, {
				...gift,
				isCompleted: true,
				received: new Date(),
			})
		} catch (error) {
			// console.log(error)
		} finally {
			setIsReceiving(false)
		}
	}

	return (
		<>
			<Card
				className='group relative overflow-hidden transition-shadow hover:shadow-lg'
				onClick={e => {
					if (!(e.target instanceof Element)) return
					if (e.target.closest('button')) return
					setIsModalOpen(true)
				}}
			>
				{/* Изображение с плейсхолдером */}
				<div className='relative h-48 w-full overflow-hidden'>
					{gift.image ? (
						<Image
							src={
								gift.image || `https://picsum.photos/seed/${gift.id}/200/300`
							}
							alt={gift.name}
							fill
							className='object-cover transition-transform duration-300 group-hover:scale-105'
						/>
					) : (
						<div className='w-full h-full relative flex items-center justify-center'>
							<div className='absolute inset-0 bg-gradient-to-b from-white/0 to-muted/90 z-0' />
							<GiftIcon className='w-24 h-24 z-10 relative' />
						</div>
					)}

					<div className='absolute bottom-2 left-2'>
						<Badge variant='secondary' className='bg-white/90 backdrop-blur-sm'>
							{gift.category || 'Uncategorized'}
						</Badge>
					</div>
				</div>
				<div className='relative'>
					<div className='absolute inset-0 bg-gradient-to-b to-white/0 from-muted/50 z-0' />
					<div className='relative'>
						<CardHeader className='pb-2'>
							<div className='flex items-start justify-between gap-2'>
								<CardTitle className='line-clamp-2 text-lg font-semibold leading-tight'>
									{gift.name}
								</CardTitle>
								<Badge className={getPriorityStyle(gift.priority)}>
									{gift.priority}
								</Badge>
							</div>
						</CardHeader>

						<CardContent className='pb-2 flex flex-col items-start'>
							<div className='flex items-baseline gap-2'>
								<span className='text-2xl font-bold text-primary'>
									{getCurrency(gift.price, viewCurrency)}
								</span>
								<span className='text-muted-foreground'>
									{getSymbol(viewCurrency)}
								</span>
							</div>

							{gift.description && (
								<p className='mt-2 line-clamp-3 text-sm text-muted-foreground'>
									{gift.description}
								</p>
							)}
							<div className='flex flex-row  justify-between items-center w-full mt-2'>
								<div className='flex items-center gap-2  '>
									{gift.isCompleted ? (
										<Tooltip>
											<TooltipTrigger asChild>
												<div>
													<Button size={'sm'} disabled className='bg-green-200'>
														<Check
															style={{ width: '18px', height: '18px' }}
															className=' text-green-700'
														/>
													</Button>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>Получен</p>
											</TooltipContent>
										</Tooltip>
									) : (
										<>
											<Button
												onClick={e => {
													e.stopPropagation()
													handleReceived()
												}}
												size={'sm'}
												disabled={isReceiving}
												className='bg-green-200 hover:bg-green-300 '
											>
												{isReceiving ? (
													<Loader2 className='animate-spin'></Loader2>
												) : (
													<Check
														style={{ width: '18px', height: '18px' }}
														className='text-green-700'
													/>
												)}
											</Button>
										</>
									)}
									{gift.isCompleted && (
										<Tooltip>
											<TooltipTrigger asChild>
												<div>
													<Button
														size={'sm'}
														disabled
														className='bg-yellow-200'
													>
														<Pencil
															style={{ width: '18px', height: '18px' }}
															className='text-yellow-700'
														></Pencil>
													</Button>
												</div>
											</TooltipTrigger>
											<TooltipContent>
												<p>Нельзя редактировать</p>
											</TooltipContent>
										</Tooltip>
									)}
									{!gift.isCompleted && (
										<GiftEditModal
											gift={gift}
											isOpen={isEditing}
											setIsOpen={setIsEditing}
											userId={gift.userId}
										></GiftEditModal>
									)}
								</div>
								<div>
									<Button
										onClick={e => {
											e.stopPropagation()
											handleDelete()
										}}
										size={'sm'}
										disabled={isDeleting}
										className='bg-red-200 hover:bg-red-300 '
									>
										<Trash
											style={{ width: '18px', height: '18px' }}
											className='text-red-700'
										></Trash>
									</Button>
								</div>
							</div>
						</CardContent>

						<CardFooter className='flex items-center justify-between pt-0 text-sm'>
							<div className='flex items-center gap-2 text-muted-foreground'>
								<GiftIcon className='h-4 w-4' />
								<span>{format(new Date(gift.createdAt), 'dd MMM yyyy')}</span>
							</div>

							{gift.link && (
								<Button
									variant='ghost'
									size='sm'
									className='gap-1'
									asChild
									onClick={e => e.stopPropagation()}
								>
									<a href={gift.link} target='_blank' rel='noopener noreferrer'>
										Ссылка
										<ArrowUpRight className='h-4 w-4' />
									</a>
								</Button>
							)}
							{!gift.link && (
								<Button
									variant='ghost'
									size='sm'
									className='gap-1 cursor-default'
								>
									Ссылки нет
								</Button>
							)}
						</CardFooter>
					</div>
				</div>
			</Card>
			<CardModalInfo
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				gift={gift}
				viewCurrency={viewCurrency}
			></CardModalInfo>
		</>
	)
}

export default GiftCard
