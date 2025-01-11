import { FC } from 'react'
import { Card, CardTitle } from '../ui/card'
import Filters from './Filters'
import { DropdownMenuSeparator } from '../ui/dropdown-menu'

interface ProfileMainProps {}

const ProfileMain: FC<ProfileMainProps> = ({}) => {
	return (
		<div className='p-6 pt-0 '>
			<Card className='w-full min-h-60 p-4 '>
				<div className='flex flex-row justify-between items-center'>
					<CardTitle>Недавние действия партнёра</CardTitle>
					<Filters></Filters>
				</div>
				<DropdownMenuSeparator className='mt-2'></DropdownMenuSeparator>
			</Card>
		</div>
	)
}

export default ProfileMain
