import YearPixels from './Pixels/YearPixels'

interface SelectPixelsManagerProps {
	selectState: string
}

const SelectPixelsManager = ({ selectState }: SelectPixelsManagerProps) => {
	return (
		<div>
			{selectState === 'Year' && <YearPixels></YearPixels>}
			{selectState === 'Month' && <div>Month</div>}
			{selectState === 'Week' && <div>Week</div>}
			{selectState === 'Day' && <div>Day</div>}
		</div>
	)
}

export default SelectPixelsManager
