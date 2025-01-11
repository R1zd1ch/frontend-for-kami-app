import { FC } from 'react'
import { Button } from '../ui/button'

interface FiltersProps {}

const Filters: FC<FiltersProps> = ({}) => {
	return (
		<div className='flex flex-row gap-4 items-center'>
			<div>Фильтры:</div>
			<Button className='text-base'>тут будут фильтры селектом</Button>
		</div>
	)
}

export default Filters
