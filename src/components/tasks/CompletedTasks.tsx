import { Check } from 'lucide-react'
import { Card, CardTitle } from '../ui/card'
import { Task } from '@/lib/types'
import { SortableContext } from '@dnd-kit/sortable'
import TaskItem from './TaskItem'
import { useMemo } from 'react'
import { useDroppable } from '@dnd-kit/core'

const CompletedTasks = ({
	tasks,
	column,
	onUpdateTask,
	onDeleteTask,
}: {
	tasks: Task[]
	column: { title: string; id: number; isDay: boolean }
	onUpdateTask: (task: Task) => Promise<void>
	onDeleteTask: (taskId: string) => Promise<void>
}) => {
	const tasksIds = useMemo(() => tasks.map(task => task.id), [tasks])

	const { setNodeRef } = useDroppable({
		id: column.id,
	})

	return (
		<Card className='bg-secondary h-full p-4 shadow-lg'>
			<div className='flex flex-row gap-2 items-center mb-2'>
				<Check className='h-6 w-6'></Check>
				<CardTitle className='font-bold text-lg p-0 mb-0'>
					{column.title}
				</CardTitle>
			</div>
			<div
				ref={setNodeRef}
				className='max-h-[95vh] min-h-[50vh] overflow-y-auto'
			>
				<SortableContext items={tasksIds}>
					{tasks.map(task => (
						<div key={task.id} className='mb-2'>
							<TaskItem
								task={task}
								onUpdateTask={onUpdateTask}
								onDeleteTask={onDeleteTask}
							></TaskItem>
						</div>
					))}
				</SortableContext>
			</div>
		</Card>
	)
}

export default CompletedTasks
