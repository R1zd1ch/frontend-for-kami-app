/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from 'recharts'
import {
	addYears,
	endOfYear,
	format,
	isValid,
	parseISO,
	startOfYear,
	subYears,
} from 'date-fns'
import { getAverageMoodByInterval } from '@/api/mood'
import { ChevronLeft, ChevronRight, Frown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ru } from 'date-fns/locale'

interface DayData {
	date: string
	average: number
}

const YearlyChart = ({
	id,
	refreshKey,
}: {
	id: string
	refreshKey: number
}) => {
	const [currentDate, setCurrentDate] = useState(new Date())
	const [chartData, setChartData] = useState<DayData[]>([])
	const [loading, setLoading] = useState(false)
	const formatDateRu = (date: string, formatString: string) => {
		return format(parseISO(date), formatString, { locale: ru })
	}

	useEffect(() => {
		fetchData()
	}, [currentDate, refreshKey])

	const fetchData = async () => {
		setLoading(true)

		const start = format(startOfYear(currentDate), 'yyyy-MM-dd')
		const end = format(endOfYear(currentDate), 'yyyy-MM-dd')

		try {
			const data = await getAverageMoodByInterval(id, start, end, 'year')

			const validData =
				data[0]?.days
					?.map((item: any) => ({
						...item,
						date: item.date && isValid(parseISO(item.date)) ? item.date : null,
					}))
					.filter((item: any) => item.date !== null)
					.reduce((acc: any[], day: any) => {
						const month = formatDateRu(day.date, 'MMM')
						const existingMonth = acc.find(item => item.month === month)
						if (existingMonth) {
							existingMonth.average += day.average
							if (day.average !== null) {
								existingMonth.count += 1
							}
						} else {
							acc.push({ month, average: day.average, count: 0 })
						}
						return acc
					}, [])
					.map((item: any) => ({
						...item,
						average: item.count > 0 ? item.average / item.count : 0,
					})) || []

			setChartData(validData)
		} catch (error) {
			console.error('Error fetching data:', error)
		} finally {
			setLoading(false)
		}
	}

	const handlePrevYear = () => {
		setCurrentDate(prev => subYears(prev, 1))
	}

	const handleNextYear = () => {
		setCurrentDate(prev => addYears(prev, 1))
	}

	return (
		<Card>
			<CardHeader>
				<div className='flex items-center justify-between mb-4'>
					<Button onClick={handlePrevYear} variant='outline' size='icon'>
						<ChevronLeft className='h-4 w-4' />
					</Button>
					<h2 className='text-xl font-semibold'>
						Год {format(currentDate, 'yyyy')}
					</h2>
					<Button onClick={handleNextYear} variant='outline' size='icon'>
						<ChevronRight className='h-4 w-4' />
					</Button>
				</div>
			</CardHeader>
			<CardContent className='pb-4 px-2'>
				{loading ? (
					<div className='flex justify-center items-center h-[500px]'>
						<p className='text-xl'>Загрузка...</p>
					</div>
				) : chartData.length > 0 ? (
					<ResponsiveContainer width='100%' height={500}>
						<BarChart
							data={chartData}
							margin={{ top: 0, right: 40, left: 0, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray='3 3' stroke='hsl(var(--muted))' />
							<XAxis dataKey='month' stroke='hsl(var(--muted-foreground))' />
							<YAxis stroke='hsl(var(--muted-foreground))' />
							<Tooltip
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
							<Bar
								dataKey='average'
								stroke='hsl(var(--chart-1))'
								type='monotone'
							>
								{chartData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill='hsl(var(--chart-1))'
										fillOpacity={1}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				) : (
					<div className='flex justify-center items-center h-[500px]'>
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

export default YearlyChart
