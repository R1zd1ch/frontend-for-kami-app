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
import { ArrowUpRight, GiftIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '../ui/button'

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
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className='lg:max-w-3xl w-full'>
				<DialogHeader>
					<DialogTitle>Подробнее</DialogTitle>
				</DialogHeader>
				<div className='grid grid-cols-2 lg:grid-cols-3  gap-8'>
					<div className='min-h-[300px] lg:min-h-auto relative'>
						{gift.image ? (
							<Image
								src={
									gift.image || `https://picsum.photos/seed/${gift.id}/200/300`
								}
								alt={gift.name}
								fill
								className='object-cover rounded-2xl'
							></Image>
						) : (
							<div className='w-full h-1/2 relative flex justify-center items-center'>
								<GiftIcon className='w-24 h-24 z-10 relative' />
							</div>
						)}
					</div>
					<div className='col-span-2'>
						<div className='flex flex-row justify-between'>
							<div className='line-clamp-2 text-xl font-semibold leading-tight'>
								{gift.name}
							</div>
							<Badge className={getPriorityStyle(gift.priority)}>
								{gift.priority}
							</Badge>
						</div>
						<div className='flex flex-col h-full justify-between  pb-5'>
							<div className='flex flex-col mt-4 gap-2'>
								<div className=''>
									<p className='text-sm'>Описание: </p>
									<div>{gift.description}</div>
								</div>
								<div>
									<p className='text-sm'>Категория: </p>
									<div>
										<Badge>{gift.category}</Badge>
									</div>
								</div>
								<div>
									<p className='text-sm'>Цена: </p>
									<div className='text-xl font-semibold'>
										{getCurrency(gift.price, viewCurrency)}{' '}
										{getSymbol(viewCurrency)}
									</div>
								</div>
							</div>
							<div className='flex flex-row-reverse items-end justify-between '>
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
											<span>Полученно: </span>
											<span>
												{format(new Date(gift.received), 'dd MMM yyyy')}
											</span>
										</div>
									)
								)}
								<div className='flex flex-col gap-1 items-start'>
									<div className='flex items-center gap-2 text-muted-foreground'>
										<GiftIcon className='h-4 w-4' />
										<span>
											{format(new Date(gift.createdAt), 'dd MMM yyyy')}
										</span>
									</div>
									{gift.isCompleted && gift.received && gift.link && (
										<div className='flex items-center gap-2 text-muted-foreground'>
											<span>Полученно: </span>
											<span>
												{format(new Date(gift.received), 'dd MMM yyyy')}
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
	)
}

export default CardModalInfo
