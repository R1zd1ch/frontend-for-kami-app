'use client'
import { Task } from '@/lib/types'
import { Card, CardTitle } from '../ui/card'
import TaskItem from './TaskItem'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { useMemo } from 'react'

const TaskColumn = ({
	column,
	tasks,
	onUpdateTask,
	onDeleteTask,
}: {
	column: { title: string; id: number; isDay: boolean }
	tasks: Task[]
	onUpdateTask: (task: Task) => Promise<void>
	onDeleteTask: (taskId: string) => Promise<void>
}) => {
	const tasksIds = useMemo(() => tasks.map(task => task.id), [tasks])

	const { setNodeRef } = useDroppable({
		id: column.id,
	})

	return (
		<Card className='bg-secondary p-4 min-h-[50vh] shadow-lg overflow-x-hidden pb-0 mb-0 flex flex-col'>
			<CardTitle className='font-bold mb-2 text-lg'>{column.title}</CardTitle>
			<div
				ref={setNodeRef}
				className='flex-1 max-h-[44vh] overflow-y-auto transition-transform delay-200 ease-out'
			>
				<SortableContext
					items={tasksIds}
					strategy={verticalListSortingStrategy}
				>
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

export default TaskColumn
