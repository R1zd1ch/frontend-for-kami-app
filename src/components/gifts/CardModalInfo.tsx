import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Gift } from '@/lib/types'
import { Badge } from '../ui/badge'
import Image from 'next/image'
import { getPriorityStyle, getCurrency, getSymbol } from './GiftCard'
import { ArrowUpRight, GiftIcon, ZoomIn } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '../ui/button'
import { useState } from 'react'

interface CardModalInfoProps {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
	gift: Gift
	viewCurrency: string
}

const CardModalInfo = ({
	isOpen,
	setIsOpen,
	gift,
	viewCurrency,
}: CardModalInfoProps) => {
	const [isImageModalOpen, setIsImageModalOpen] = useState(false)

	return (
		<>
			{/* Основная модалка с информацией */}
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='lg:max-w-3xl w-full'>
					<DialogHeader>
						<DialogTitle>Подробнее</DialogTitle>
					</DialogHeader>
					<div className='grid grid-cols-2 lg:grid-cols-3 gap-8'>
						{/* Блок с изображением */}
						<div
							className='min-h-[300px] lg:min-h-auto relative group cursor-zoom-in'
							onClick={() => gift.image && setIsImageModalOpen(true)}
						>
							{gift.image ? (
								<>
									<Image
										src={gift.image}
										alt={gift.name}
										fill
										className='object-cover rounded-2xl'
										priority
									/>
									<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl'>
										<ZoomIn className='w-12 h-12 text-white/90' />
									</div>
								</>
							) : (
								<div className='w-full h-full relative flex justify-center items-center bg-muted rounded-2xl'>
									<GiftIcon className='w-24 h-24 text-muted-foreground' />
								</div>
							)}
						</div>

						{/* Блок с информацией */}
						<div className='col-span-2'>
							<div className='flex flex-row justify-between'>
								<div className='line-clamp-2 text-xl font-semibold leading-tight'>
									{gift.name}
								</div>
								<Badge className={getPriorityStyle(gift.priority)}>
									{gift.priority}
								</Badge>
							</div>

							<div className='flex flex-col h-full justify-between pb-5'>
								<div className='flex flex-col mt-4 gap-2'>
									<div>
										<p className='text-sm text-muted-foreground'>Описание</p>
										<div className='mt-1'>
											{gift.description || 'Нет описания'}
										</div>
									</div>

									<div>
										<p className='text-sm text-muted-foreground'>Категория</p>
										<div className='mt-1'>
											<Badge variant='secondary'>{gift.category}</Badge>
										</div>
									</div>

									<div>
										<p className='text-sm text-muted-foreground'>Цена</p>
										<div className='text-xl font-semibold mt-1'>
											{getCurrency(gift.price, viewCurrency)}
											<span className='ml-1 text-base font-normal'>
												{getSymbol(viewCurrency)}
											</span>
										</div>
									</div>
								</div>

								<div className='flex flex-row-reverse items-end justify-between mt-4'>
									{gift.link ? (
										<Button
											variant='ghost'
											size='sm'
											className='gap-1'
											asChild
											onClick={e => e.stopPropagation()}
										>
											<a
												href={gift.link}
												target='_blank'
												rel='noopener noreferrer'
											>
												Ссылка
												<ArrowUpRight className='h-4 w-4' />
											</a>
										</Button>
									) : (
										gift.isCompleted &&
										gift.received && (
											<div className='flex items-center gap-2 text-muted-foreground'>
												<span>Получено: </span>
												<span>
													{format(new Date(gift.received), 'dd.MM.yyyy')}
												</span>
											</div>
										)
									)}

									<div className='flex flex-col gap-1 items-start'>
										<div className='flex items-center gap-2 text-muted-foreground'>
											<GiftIcon className='h-4 w-4' />
											<span>
												{format(new Date(gift.createdAt), 'dd.MM.yyyy')}
											</span>
										</div>
										{gift.isCompleted && gift.received && gift.link && (
											<div className='flex items-center gap-2 text-muted-foreground'>
												<span>Получено: </span>
												<span>
													{format(new Date(gift.received), 'dd.MM.yyyy')}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</DialogContent>
			</Dialog>

			{/* Модалка для полноразмерного изображения */}
			<Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
				<DialogContent className='max-w-[90vw] max-h-[90vh] p-2'>
					<DialogHeader>
						<DialogTitle></DialogTitle>
					</DialogHeader>
					<div className='relative w-full h-[80vh]'>
						{gift.image && (
							<Image
								src={gift.image}
								alt={gift.name}
								fill
								className='object-contain p-4'
								sizes='(max-width: 768px) 100vw, 80vw'
								priority
							/>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}

export default CardModalInfo
