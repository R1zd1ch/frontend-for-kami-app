import { useGiftStore } from '@/storage/giftStore'
import { Frown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Progress } from '../ui/progress'

const GiftCategories = () => {
	const { categories, loading } = useGiftStore()

	if (categories === null && !loading)
		return (
			<div className='w-full h-full flex flex-row items-center justify-center gap-4 '>
				<Frown className='w-20 h-20'></Frown>
				<div className='text-3xl font-bold'>У вас пока нет желаний</div>
			</div>
		)

	if (loading) return <div>Loading...</div>

	return (
		<div className='flex flex-col gap-10'>
			<div>
				<div className='text-xl font-bold mb-3'>Все категории</div>
				<div className='grid grid-cols-3 gap-4'>
					{Object.keys(categories?.items.all || {}).map(category => (
						<CategoryCard
							key={category}
							category={category}
							categoryValue={categories?.items.all[category] || 0}
							all={categories?.all || 0}
						/>
					))}
				</div>
			</div>

			{categories?.items.completed && (
				<div>
					<div className='text-xl font-bold mb-3'>
						Категории, вы уже получили
					</div>
					<div className='grid grid-cols-3 gap-4'>
						{Object.keys(categories?.items.completed || {}).map(category => (
							<CategoryCard
								key={category}
								category={category}
								categoryValue={categories?.items.completed[category] || 0}
								all={categories?.all || 0}
							/>
						))}
					</div>
				</div>
			)}

			{categories?.items.notCompleted && (
				<div>
					<div className='text-xl font-bold mb-3'>
						Категории, которые вы ещё желаете
					</div>
					<div className='grid grid-cols-3 gap-4'>
						{Object.keys(categories?.items.notCompleted || {}).map(category => (
							<CategoryCard
								key={category}
								category={category}
								categoryValue={categories?.items.notCompleted[category] || 0}
								all={categories?.all || 0}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

const CategoryCard = ({
	category,
	categoryValue,
	all,
}: {
	category: string
	categoryValue: number
	all: number
}) => {
	// console.log(category)
	return (
		<Card className='p-4'>
			<CardHeader className='p-0 pb-2'>
				<CardTitle>{category}</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-1 p-0'>
				{categoryValue} из {all}
				<Progress className='w-full' value={(categoryValue / all) * 100} />
			</CardContent>
		</Card>
	)
}

export default GiftCategories
