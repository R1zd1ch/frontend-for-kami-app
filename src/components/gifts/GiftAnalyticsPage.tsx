import { useGiftStore } from '@/storage/giftStore'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Frown } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getCurrency, getSymbol } from './GiftCard'

const GiftAnalyticsPage = ({ viewCurrency }: { viewCurrency: string }) => {
	const { analytics, loading } = useGiftStore()

	if (!loading && analytics === null) {
		return (
			<div className='w-full h-full flex flex-row items-center justify-center gap-4 '>
				<Frown className='w-20 h-20'></Frown>
				<div className='text-3xl font-bold'>У вас пока нет желаний</div>
			</div>
		)
	}

	if (loading) return <div>Loading...</div>
	console.log(analytics)

	return (
		<div className='flex flex-col gap-10'>
			<div>
				<div className='text-xl font-bold mb-3'>Вся аналитика</div>
				<div className='grid grid-cols-3 gap-4'>
					{Object.keys(analytics?.all || {}).map(analytic => (
						<AnalyticsCard
							key={analytic}
							analyticTitle={analytic}
							analyticValue={analytics?.all[analytic]}
							viewCurrency={viewCurrency}
						></AnalyticsCard>
					))}
				</div>
			</div>

			{analytics?.completed && (
				<div>
					<div className='text-xl font-bold mb-3'>Аналитика завершенных</div>
					<div className='grid grid-cols-3 gap-4'>
						{Object.keys(analytics?.completed || {}).map(analytic => (
							<AnalyticsCard
								key={analytic}
								analyticTitle={analytic}
								analyticValue={analytics?.completed[analytic]}
								viewCurrency={viewCurrency}
							></AnalyticsCard>
						))}
					</div>
				</div>
			)}

			{analytics?.notCompleted && (
				<div>
					<div className='text-xl font-bold mb-3'>Аналитика не завершенных</div>
					<div className='grid grid-cols-3 gap-4'>
						{Object.keys(analytics?.notCompleted || {}).map(analytic => (
							<AnalyticsCard
								key={analytic}
								analyticTitle={analytic}
								analyticValue={analytics?.notCompleted[analytic]}
								viewCurrency={viewCurrency}
							></AnalyticsCard>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

const valuesAnalytics = {
	totalItems: 'Всего желаний',
	totalPrice: 'Общая стоимость',
	avgItemsPrice: 'Средняя стоимость',
	mostCategory: 'Популярная категория',
}

const AnalyticsCard = ({
	analyticTitle,
	analyticValue,
	viewCurrency,
}: {
	analyticTitle: string
	analyticValue: number | string | undefined
	viewCurrency: string
}) => {
	const [value, setValue] = useState<number | string | undefined>(analyticValue)

	useEffect(() => {
		if (
			analyticTitle === 'totalPrice' ||
			(analyticTitle === 'avgItemsPrice' && analyticValue)
		) {
			setValue(
				getCurrency(
					parseInt(analyticValue?.toString() || '0', 10),
					viewCurrency
				)
			)
		}
	}, [analyticValue, analyticTitle, viewCurrency])

	return (
		<Card className='p-4'>
			<CardHeader className='p-0 pb-2'>
				<CardTitle className='text-2xl font-bold'>
					{valuesAnalytics[analyticTitle as keyof typeof valuesAnalytics]}
				</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-1 p-0 text-lg font-semibold text-muted-foreground'>
				{analyticTitle === 'totalPrice' || analyticTitle === 'avgItemsPrice'
					? `${value} ${getSymbol(viewCurrency)}`
					: analyticValue}
			</CardContent>
		</Card>
	)
}

export default GiftAnalyticsPage
