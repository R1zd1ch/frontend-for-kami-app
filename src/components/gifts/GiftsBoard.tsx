'use client'

import { useGiftStore } from '@/storage/giftStore'
import { GiftIcon, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import GiftNav from './GiftNav'
import GiftContentManager from './GiftContentManager'
import { Input } from '../ui/input'
import Fuse from 'fuse.js'
import { Gift } from '@/lib/types'
import useSidebarStore from '@/storage/countSidebar'
import { fi } from 'date-fns/locale'
interface GiftsBoardProps {
	userId: string
}

const navItems = [
	{ label: 'Желания', value: 'gifts' },
	{ label: 'Категории', value: 'categories' },
	{ label: 'Аналитика', value: 'analytics' },
	{ label: 'Полученно', value: 'completed' },
]

const GiftsBoard = ({ userId }: GiftsBoardProps) => {
	const { fetchGifts, gifts, fetchCategories, fetchAnalytics } = useGiftStore()

	const { getItemLength, incrementItemLength, decrementItemLength } =
		useSidebarStore()
	const [navSelect, setNavSelect] = useState('gifts')
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredGifts, setGifts] = useState<Gift[]>(gifts)
	const [viewCurrency, setViewCurrency] = useState('USD')

	const fuse = useMemo(
		() =>
			new Fuse(gifts, {
				keys: ['name', 'description', 'category'],
				threshold: 0.3,
				includeScore: true,
			}),
		[gifts]
	)

	useEffect(() => {
		const dataLength = getItemLength('Wish Лист')
		const filteredGiftsLength = gifts.filter(g => !g.isCompleted).length

		if (dataLength && dataLength < filteredGiftsLength) {
			incrementItemLength('Wish Лист')
		}

		if (dataLength && dataLength > filteredGiftsLength) {
			decrementItemLength('Wish Лист')
		}
	}, [gifts])

	useEffect(() => {
		if (navSelect !== 'gifts' && navSelect !== 'completed') return

		const term = searchTerm.trim()
		if (term) {
			const results = fuse.search(term)
			setGifts(results.map(result => result.item))
		} else {
			setGifts(gifts)
		}
	}, [searchTerm, navSelect, fuse, gifts])

	const handleSearchChange = (v: string) => {
		setSearchTerm(v)
	}

	useEffect(() => {
		fetchGifts(userId)
		fetchCategories(userId)
		fetchAnalytics(userId)
	}, [userId])

	return (
		<div className='space-y-6'>
			<div className='flex flex-col md:flex-row justify-between items-start gap-4'>
				<div className='flex flex-col flex-1'>
					<div className='flex items-center gap-2 mb-2'>
						<GiftIcon className='h-8 w-8' />
						<h1 className='text-3xl font-bold'>Список желаний</h1>
					</div>
					<p className='text-muted-foreground text-sm'>
						Здесь вы можете оставить свои желания, которые будут видны вашим
						контактам
					</p>
				</div>
			</div>
			<div className='grid grid-cols-8 gap-16'>
				<div className='col-span-6 flex flex-col gap-4'>
					<GiftContentManager
						navSelect={navSelect}
						viewCurrency={viewCurrency}
						filteredGifts={filteredGifts}
					></GiftContentManager>
				</div>
				<div className='col-span-2 flex flex-col gap-4'>
					<div className='w-full md:max-w-sm'>
						<div className='flex items-center rounded-lg border border-primary bg-muted px-3.5 py-2'>
							<Search className='w-6 h-6 mr-2' />
							<Input
								placeholder='Поиск желаемого'
								className='border-none bg-transparent focus-visible:ring-0'
								value={searchTerm}
								onChange={e => handleSearchChange(e.target.value)}
								autoComplete='off'
								autoCorrect='off'
								autoCapitalize='off'
								spellCheck='false'
								aria-label='Поиск желаемого'
								aria-describedby='search'
								aria-controls='search'
								aria-autocomplete='list'
								aria-live='polite'
								aria-activedescendant='search'
								aria-owns='search'
								aria-busy='false'
								aria-invalid='false'
								aria-errormessage='search'
								aria-flowto='search'
							/>
						</div>
					</div>

					<GiftNav
						id={userId}
						navItems={navItems}
						navSelect={navSelect}
						setNavSelect={setNavSelect}
						viewCurrency={viewCurrency}
						setViewCurrency={setViewCurrency}
					></GiftNav>
				</div>
			</div>
		</div>
	)
}

export default GiftsBoard
