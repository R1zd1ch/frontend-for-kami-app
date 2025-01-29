import { useState } from 'react'
import { Card, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import GiftAddModal from './GiftAddModal'

interface GiftNavProps {
	id: string
	navItems: {
		label: string
		value: string
	}[]
	navSelect: string
	setNavSelect: (value: string) => void
	viewCurrency: string
	setViewCurrency: (value: string) => void
}

const GiftNav = ({
	id,
	navItems,
	navSelect,
	setNavSelect,
	viewCurrency,
	setViewCurrency,
}: GiftNavProps) => {
	const [isOpen, setIsOpen] = useState(false)
	return (
		<div className='flex flex-col gap-4'>
			<Card className='p-4 flex flex-col gap-4'>
				<GiftAddModal
					id={id}
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					viewCurrency={viewCurrency}
				></GiftAddModal>
			</Card>
			<Card className='p-4 flex flex-row gap-4 items-center '>
				<p>Валюта:</p>

				<Select value={viewCurrency} onValueChange={setViewCurrency}>
					<SelectTrigger className='w-24'>
						<SelectValue placeholder={viewCurrency} />
					</SelectTrigger>

					<SelectContent>
						<SelectItem value='USD'>USD</SelectItem>
						<SelectItem value='EUR'>EUR</SelectItem>
						<SelectItem value='RUB'>RUB</SelectItem>
					</SelectContent>
				</Select>
			</Card>
			<Card className='p-4 flex flex-col gap-4'>
				<CardHeader className='p-0'>
					<CardTitle className='text-lg'>Вкладки:</CardTitle>
				</CardHeader>
				{navItems.map(item => (
					<Button
						key={item.value}
						variant={item.value === navSelect ? 'default' : 'outline'}
						onClick={() => setNavSelect(item.value)}
					>
						{item.label}
					</Button>
				))}
			</Card>
		</div>
	)
}

export default GiftNav
