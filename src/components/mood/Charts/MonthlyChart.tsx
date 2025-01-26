/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import {
	format,
	parseISO,
	isValid,
	startOfMonth,
	endOfMonth,
	subMonths,
	addMonths,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'
import { getAverageMoodByInterval } from '@/api/mood'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Frown } from 'lucide-react'

interface DayData {
	date: string
	average: number
}

const MonthlyChart = ({
	id,
	refreshKey,
}: {
	id: string
	refreshKey: number
}) => {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [chartData, setChartData] = useState<DayData[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		fetchData()
	}, [currentDate, refreshKey])

	const fetchData = async () => {
		setLoading(true)

		const start = format(startOfMonth(currentDate), 'yyyy-MM-dd')
		const end = format(endOfMonth(currentDate), 'yyyy-MM-dd')

		try {
			const data = await getAverageMoodByInterval(id, start, end, 'month')
			const validData =
				data[0]?.days?.map((item: any) => ({
					...item,
					date: item.date && isValid(parseISO(item.date)) ? item.date : null,
				})) || []
			setChartData(validData.filter((item: any) => item.date !== null))
		} catch (error) {
			console.error('Error fetching data:', error)
			setChartData([])
		} finally {
			setLoading(false)
		}
	}

	const handlePrevMonth = () => {
		setCurrentDate(prev => subMonths(prev, 1))
	}

	const handleNextMonth = () => {
		setCurrentDate(prev => addMonths(prev, 1))
	}

	const formatDateRu = (date: string, formatString: string) => {
		return format(parseISO(date), formatString, { locale: ru })
	}

	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between mb-4'>
					<Button onClick={handlePrevMonth} variant='outline' size='icon'>
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<h2 className='text-xl font-semibold'>
						Месяц {formatDateRu(currentDate.toISOString(), 'LLLL, YYY')}
					</h2>
					<Button onClick={handleNextMonth} variant='outline' size='icon'>
						<ChevronRight className='h-4 w-4' />
					</Button>
				</div>
			</CardHeader>
			<CardContent className='pb-4 px-2'>
				{loading ? (
					<div className='flex justify-center items-center h-[300px]'>
						<p className='text-xl'>Загрузка...</p>
					</div>
				) : chartData.length > 0 ? (
					<ResponsiveContainer width='100%' height={300}>
						<AreaChart
							data={chartData}
							margin={{ top: 0, right: 40, left: 0, bottom: 5 }}
						>
							<defs>
								<linearGradient id='colorAverage' x1='0' y1='0' x2='0' y2='1'>
									<stop
										offset='5%'
										stopColor='hsl(var(--chart-1))'
										stopOpacity={0.8}
									/>
									<stop
										offset='95%'
										stopColor='hsl(var(--chart-1))'
										stopOpacity={0}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--muted))' />
							<XAxis
								dataKey='date'
								tickFormatter={tickItem => formatDateRu(tickItem, 'd')}
								interval={2}
								stroke='hsl(var(--muted-foreground))'
							/>
							<YAxis stroke='hsl(var(--muted-foreground))' />
							<Tooltip
								labelFormatter={label => formatDateRu(label, 'MMMM d, yyyy')}
								formatter={(value: any) => [
									`${value.toFixed(1)}`,
									'Среднее настроение',
								]}
								contentStyle={{
									backgroundColor: 'hsl(var(--popover))',
									color: 'hsl(var(--popover-foreground))',
									borderRadius: 'var(--radius)',
									border: '1px solid hsl(var(--border))',
								}}
							/>
							<Area
								type='monotone'
								dataKey='average'
								stroke='hsl(var(--chart-1))'
								fillOpacity={1}
								fill='url(#colorAverage)'
							/>
						</AreaChart>
					</ResponsiveContainer>
				) : (
					<div className='flex justify-center items-center h-[300px]'>
						<div className='flex flex-row gap-4 items-center'>
							<p className='text-3xl font-bold'>Нет данных</p>
							<Frown className='w-24 h-24 text-primary opacity-80' />
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

export default MonthlyChart
