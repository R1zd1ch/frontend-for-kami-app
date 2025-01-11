import { FC, useState } from 'react'
import { Card } from '../ui/card'
import { useSortable } from '@dnd-kit/sortable'
import { Task } from '@/lib/types'
import { CSS } from '@dnd-kit/utilities'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Check, Trash } from 'lucide-react'
import {
	Select,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectContent,
} from '../ui/select'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'

interface TaskItemProps {
	task: Task
	onUpdateTask: (task: Task) => Promise<void>
	onDeleteTask: (taskId: string) => Promise<void>
}

const TaskItem: FC<TaskItemProps> = ({ task, onUpdateTask, onDeleteTask }) => {
	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: task.id,
		data: {
			type: 'Task',
			task,
		},
	})

	const [editingField, setEditingField] = useState<
		null | 'title' | 'description' | 'subject' | 'dueDate' | 'importance'
	>(null)
	const [editedTask, setEditedTask] = useState<Task>(task)
	const [openDelete, setOpenDelete] = useState<boolean>(false)

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.6 : 1,
	}

	const handleSave = async () => {
		if (
			editedTask.title.trim() !== '' &&
			editedTask.description.trim() !== ''
		) {
			await onUpdateTask({
				...editedTask,
				dueDate: new Date(editedTask.dueDate).toISOString(),
			})
			setEditingField(null)
		}
	}

	const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			await handleSave()
		} else if (e.key === 'Escape') {
			setEditedTask(task)
			setEditingField(null)
		}
	}

	const handleDeleteTask = async () => {
		await onDeleteTask(task.id)
	}

	return (
		<Card
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			className={`p-4 mb-4 shadow-lg rounded-lg flex flex-col gap-1 ${
				task.isCompleted ? 'bg-input' : ''
			}`}
		>
			<div className='grid grid-cols-6 gap-4'>
				<div className='col-span-5'>
					{/* Заголовок */}
					{editingField === 'title' ? (
						<Input
							value={editedTask.title}
							onChange={e =>
								setEditedTask(prev => ({ ...prev, title: e.target.value }))
							}
							onKeyDown={handleKeyDown}
							autoFocus
							placeholder='Название задачи'
							className='mb-2'
						/>
					) : (
						<h3
							className={`font-semibold text-lg break-words whitespace-normal cursor-pointer ${
								task.isCompleted ? 'line-through' : ''
							}`}
							onClick={() => setEditingField('title')}
						>
							{task.title}
						</h3>
					)}

					{/* Описание */}
					{editingField === 'description' ? (
						<Input
							value={editedTask.description}
							onChange={e =>
								setEditedTask(prev => ({
									...prev,
									description: e.target.value,
								}))
							}
							onKeyDown={handleKeyDown}
							autoFocus
							placeholder='Описание задачи'
						/>
					) : (
						<p
							className={`text-sm text-secondary-foreground break-words whitespace-normal cursor-pointer ${
								task.isCompleted ? 'line-through' : ''
							}`}
							onClick={() => setEditingField('description')}
						>
							{task.description}
						</p>
					)}

					{/* Дата */}
					{editingField === 'dueDate' ? (
						<div>
							<Input
								type='date'
								id='dueDate'
								name='dueDate'
								className='w-fit'
								value={editedTask.dueDate}
								onKeyDown={e => {
									if (e.key === 'Enter') {
										e.preventDefault()
										handleSave()
									} else if (e.key === 'Escape') {
										setEditedTask(task)
										setEditingField(null)
									}
								}}
								onChange={e => {
									setEditedTask(prev => ({
										...prev,
										dueDate: e.target.value,
									}))
								}}
							/>
						</div>
					) : (
						<span
							className={`text-sm text-gray-500 break-words cursor-pointer ${
								task.isCompleted ? 'line-through' : ''
							}`}
							onClick={() => setEditingField('dueDate')}
						>
							{format(task.dueDate, 'dd MMMM, eeee', { locale: ru })}
						</span>
					)}
				</div>

				<div className='col-span-1 flex items-start justify-end'>
					<div className='flex items-center justify-center'>
						<Dialog open={openDelete} onOpenChange={setOpenDelete}>
							<DialogTrigger asChild onClick={() => setOpenDelete(true)}>
								<Button size='icon' variant='ghost'>
									<Trash className='w-4 h-4 text-red-500' />
								</Button>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Хотите удалить задачу?</DialogTitle>
									<DialogDescription>
										Вы уверены, что хотите удалить задачу?
									</DialogDescription>
								</DialogHeader>
								<Button
									onClick={() => {
										handleDeleteTask()
										setOpenDelete(false)
									}}
								>
									Удалить
								</Button>
							</DialogContent>
						</Dialog>

						{task.isCompleted && (
							<div className='rounded-full bg-green-100 shadow-md'>
								<Check className='w-6 h-6 text-green-800'></Check>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className=' flex justify-between items-center'>
				{/* Предмет */}
				{editingField === 'subject' ? (
					<Input
						value={editedTask.subject}
						onChange={e =>
							setEditedTask(prev => ({ ...prev, subject: e.target.value }))
						}
						onKeyDown={handleKeyDown}
						autoFocus
						placeholder='Предмет'
						className='w-1/2'
					/>
				) : (
					<p
						className={`text-sm text-blue-600 break-words whitespace-normal cursor-pointer ${
							task.isCompleted ? 'line-through' : ''
						}`}
						onClick={() => setEditingField('subject')}
					>
						{task.subject}
					</p>
				)}
				<div
					onKeyDown={e => {
						if (e.key === 'Enter') {
							e.preventDefault()
							e.stopPropagation()
							handleSave()
						} else if (e.key === 'Escape') {
							e.preventDefault()
							e.stopPropagation()
							setEditedTask(task)
							setEditingField(null)
						}
					}}
				>
					{/* Важность */}
					{editingField === 'importance' ? (
						<Select
							value={editedTask.importance}
							onValueChange={value =>
								setEditedTask(prev => ({
									...prev,
									importance: value as Task['importance'],
								}))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='Выберите важность' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='высокая'>Высокая</SelectItem>
								<SelectItem value='средняя'>Средняя</SelectItem>
								<SelectItem value='низкая'>Низкая</SelectItem>
							</SelectContent>
						</Select>
					) : (
						<span
							className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${getImportanceColor(
								task.importance
							)}`}
							onClick={() => setEditingField('importance')}
						>
							{task.importance}
						</span>
					)}
				</div>
			</div>
		</Card>
	)
}

function getImportanceColor(importance: Task['importance']): string {
	switch (importance) {
		case 'высокая':
			return 'bg-red-100 text-red-800'
		case 'средняя':
			return 'bg-yellow-100 text-yellow-800'
		case 'низкая':
			return 'bg-green-100 text-green-800'
		default:
			return 'bg-gray-100 text-gray-800'
	}
}

export default TaskItem
