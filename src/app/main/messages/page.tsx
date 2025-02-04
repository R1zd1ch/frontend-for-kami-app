import { Card } from '@/components/ui/card'

const pages = ({}) => {
	return (
		<Card className='flex-1 flex items-center justify-center bg-muted/50 rounded-3xl'>
			<div className='text-center space-y-2'>
				<h3 className='text-2xl font-bold'>Выберите чат</h3>
				<p className='text-muted-foreground'>
					Начните общение, выбрав чат из меню
				</p>
			</div>
		</Card>
	)
}

export default pages
