'use client'
import { Gift } from '@/lib/types'
import GiftCard from './GiftCard'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import GiftCategories from './GiftCategories'
import GiftAnalyticsPage from './GiftAnalyticsPage'
import { useGiftStore } from '@/storage/giftStore'

interface GiftContentManagerProps {
	filteredGifts: Gift[]
	viewCurrency: string
	navSelect: string
}

const GiftContentManager = ({
	filteredGifts,
	viewCurrency,
	navSelect,
}: GiftContentManagerProps) => {
	const { loading } = useGiftStore()

	if (loading) return <div>Loading...</div>

	if (filteredGifts.length === 0) {
		return <></>
	}

	return (
		<>
			<TooltipProvider delayDuration={500}>
				{navSelect === 'gifts' && (
					<div className='grid grid-cols-3 gap-4'>
						{filteredGifts
							.filter(gift => !gift.isCompleted)
							.map(gift => (
								<Tooltip key={gift.id} delayDuration={500}>
									<TooltipTrigger asChild>
										<div>
											<GiftCard
												gift={gift}
												viewCurrency={viewCurrency}
											></GiftCard>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Нажми, чтобы узнать подробнее</p>
									</TooltipContent>
								</Tooltip>
							))}
					</div>
				)}
			</TooltipProvider>

			{navSelect === 'categories' && <GiftCategories></GiftCategories>}

			{navSelect === 'analytics' && (
				<GiftAnalyticsPage viewCurrency={viewCurrency}></GiftAnalyticsPage>
			)}
			<TooltipProvider delayDuration={500}>
				{navSelect === 'completed' && (
					<div className='grid grid-cols-3 gap-4'>
						{filteredGifts
							.filter(gift => gift.isCompleted)
							.map(gift => (
								<Tooltip key={gift.id} delayDuration={500}>
									<TooltipTrigger asChild>
										<div>
											<GiftCard
												gift={gift}
												viewCurrency={viewCurrency}
											></GiftCard>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Нажми, чтобы узнать подробнее</p>
									</TooltipContent>
								</Tooltip>
							))}
					</div>
				)}
			</TooltipProvider>
		</>
	)
}

export default GiftContentManager
