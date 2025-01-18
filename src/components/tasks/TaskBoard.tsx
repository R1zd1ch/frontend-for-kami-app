'use client'
import dynamic from 'next/dynamic'

const TaskColumn = dynamic(() => import('@/components/tasks/TaskColumn'), {
	ssr: false,
})
const CompletedTasks = dynamic(
	() => import('@/components/tasks/CompletedTasks'),
	{
		ssr: false,
	}
)
import { Task } from '@/lib/types'
import { useEffect, useState } from 'react'
import { columns } from './ext'
import { createTask, deleteTask, getTasks, updateTask } from '@/api/tasks'
import { CreateTaskModal } from './CreateTaskModal'
import {
	DndContext,
	DragEndEvent,
	DragOverEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { createPortal } from 'react-dom'
import TaskItem from './TaskItem'
import { arrayMove } from '@dnd-kit/sortable'
import useSidebarStore from '@/storage/countSidebar'
import { toast } from 'sonner'
const TaskBoard = ({ token, id }: { id: string; token: string }) => {
	const [tasks, setTasks] = useState<Task[]>([])
	const [activeTask, setActiveTask] = useState<Task | null>(null)
	const [isClient, setIsClient] = useState(false)
	const { incrementItemLength, decrementItemLength } = useSidebarStore()

	useEffect(() => {
		const fetchTasks = async () => {
			const tasks = await getTasks(id)
			setTasks(tasks)
		}
		fetchTasks()
	}, [])

	useEffect(() => {
		setIsClient(true)
	}, [])

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 10,
			},
		})
	)

	const onDragStartEvent = (event: DragStartEvent) => {
		if (event.active.data.current?.type === 'Task') {
			setActiveTask(event.active.data.current.task)
			return
		}
	}
	// useEffect(() => {
	// 	const notCompletedTasks = tasks.filter(task => !task.isCompleted)
	// 	console.log(notCompletedTasks)
	// }, [tasks])

	// useEffect(() => {
	// 	const notCompletedTasks = tasks.filter(task => !task.isCompleted)
	// 	if (
	// 		itemLengths['Задачи'] &&
	// 		itemLengths['Задачи'] < notCompletedTasks.length
	// 	) {
	// 		incrementItemLength('Задачи')
	// 		console.log(itemLengths['Задачи'])
	// 	}
	// }, [activeTask])

	const onDragEndEvent = async (event: DragEndEvent) => {
		console.log(event)
		if (!activeTask) return

		const update = async () =>
			await updateTask(
				id,
				activeTask.id,
				{
					title: activeTask.title,
					selectDay: activeTask.selectDay,
					description: activeTask.description,
					isCompleted: activeTask.isCompleted,
					subject: activeTask.subject,
					dueDate: activeTask.dueDate,
					importance: activeTask.importance,
				},
				token
			)

		if (activeTask?.selectDay === 'Выполненные задачи') {
			if (activeTask.isCompleted) {
				await update()
				return
			}
			decrementItemLength('Задачи')
			activeTask.isCompleted = true
		}
		if (activeTask?.selectDay !== 'Выполненные задачи') {
			if (!activeTask.isCompleted) {
				await update()
				return
			}
			incrementItemLength('Задачи')
			activeTask.isCompleted = false
		}

		await update()

		setActiveTask(null)
	}

	const onDragOverEvent = (event: DragOverEvent) => {
		const { active, over } = event
		if (!over) return

		const activeId = active.id
		const overId = over.id
		console.log(activeId, overId)

		if (activeId === overId) return

		const isActiveTask = active.data.current?.type === 'Task'
		const isOverTask = over.data.current?.type === 'Task'

		if (!isActiveTask) return

		if (isActiveTask && isOverTask) {
			setTasks(tasks => {
				const activeIndex = tasks.findIndex(task => task.id === activeId)
				const overIndex = tasks.findIndex(task => task.id === overId)

				tasks[activeIndex].selectDay = tasks[overIndex].selectDay

				tasks[overIndex].selectDay = tasks[activeIndex].selectDay
				// if (tasks[overIndex].selectDay === 'Выполненные задачи') {
				// 	tasks[overIndex].isCompleted = true
				// }

				// if (tasks[activeIndex].selectDay === 'Выполненные задачи') {
				// 	tasks[activeIndex].isCompleted = true
				// }

				return arrayMove(tasks, activeIndex, overIndex)
			})
		}
		if (isActiveTask && !isOverTask) {
			setTasks(prevTasks => {
				const activeTask = prevTasks.find(task => task.id === activeId)
				if (!activeTask) return prevTasks

				activeTask.selectDay =
					columns.find(col => col.id === overId)?.title || ''

				return [...prevTasks]
			})
		}
	}

	const handleCreateTask = async (
		newTask: Omit<
			Task,
			'id' | 'createdAt' | 'updatedAt' | 'userId' | 'isCompleted'
		>
	): Promise<void> => {
		const createdTask = await createTask(id, newTask, token)
		toast('Задача создана', {
			description: 'Задача успешно создана',
			duration: 2000,
		})
		incrementItemLength('Задачи')
		setTasks([...tasks, createdTask])
	}

	const handleUpdateTask = async (
		updatedTask: Omit<
			Task,
			'createdAt' | 'updatedAt' | 'userId' | 'isCompleted'
		>
	): Promise<void> => {
		const updatedTaskRes = await updateTask(id, updatedTask.id, {
			title: updatedTask.title,
			selectDay: updatedTask.selectDay,
			description: updatedTask.description,
			isCompleted:
				updatedTask.selectDay === 'Выполненные задачи' ? true : false,
			subject: updatedTask.subject,
			dueDate: updatedTask.dueDate,
			importance: updatedTask.importance,
		})
		toast('Задача обновлена', {
			description: 'Задача успешно обновлена',
			duration: 2000,
		})
		setTasks(prevTasks =>
			prevTasks.map(task =>
				task.id === updatedTaskRes.id ? updatedTaskRes : task
			)
		)
	}

	const handleDeleteTask = async (taskId: string): Promise<void> => {
		await deleteTask(id, taskId, token)
		setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
		const numeredTaskId = parseInt(taskId, 10)
		toast('Задача обновлена', {
			description: 'Задача успешно обновлена',
			duration: 2000,
		})
		if (!tasks[numeredTaskId].isCompleted) {
			decrementItemLength('Задачи')
		}
	}

	return (
		<div>
			<div className='flex flex-row justify-between'>
				<h1 className='text-2xl font-bold mb-4 '>Мои задачи</h1>
				<div className='mb-4'>
					<CreateTaskModal onCreateTask={handleCreateTask}></CreateTaskModal>
				</div>
			</div>
			<DndContext
				sensors={sensors}
				onDragStart={onDragStartEvent}
				onDragOver={onDragOverEvent}
				onDragEnd={onDragEndEvent}
			>
				<div className='grid grid-cols-4 grid-rows-3 gap-4'>
					<div className='grid grid-cols-2 md:grid-cols-3 row-span-3 col-span-3 gap-4'>
						{/* <DndContext
							sensors={sensors}
							onDragStart={onDragStartEvent}
							onDragOver={onDragOverEvent}
							onDragEnd={onDragEndEvent}
						> */}
						{columns
							.filter(column => column.isDay)
							.map((column, index) => (
								<div key={index}>
									<TaskColumn
										column={column}
										tasks={tasks.filter(
											task => task.selectDay === column.title
										)}
										onDeleteTask={handleDeleteTask}
										onUpdateTask={handleUpdateTask}
									></TaskColumn>
								</div>
							))}

						{/* {isClient &&
							createPortal(
								<DragOverlay>
									{activeTask && <TaskItem task={activeTask}></TaskItem>}
								</DragOverlay>,
								document.body
							)} */}
						{/* </DndContext> */}
					</div>
					<div className='col-span-1 row-span-2'>
						<CompletedTasks
							column={
								columns.find(col => col.id === 8) || {
									title: '',
									id: 8,
									isDay: false,
								}
							}
							onDeleteTask={handleDeleteTask}
							onUpdateTask={handleUpdateTask}
							tasks={tasks.filter(
								task => task.selectDay === 'Выполненные задачи'
							)}
						></CompletedTasks>
					</div>
				</div>
				{isClient &&
					createPortal(
						<DragOverlay>
							{activeTask && (
								<TaskItem
									task={activeTask}
									onDeleteTask={handleDeleteTask}
									onUpdateTask={handleUpdateTask}
								></TaskItem>
							)}
						</DragOverlay>,
						document.body
					)}
			</DndContext>
		</div>
	)
}

export default TaskBoard
