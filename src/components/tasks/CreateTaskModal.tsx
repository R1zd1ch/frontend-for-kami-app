'use client'
import { useState } from 'react'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { columns } from './ext'
import { Task } from '@/lib/types'

interface CreateTaskModalProps {
	onCreateTask: (
		task: Omit<
			Task,
			'id' | 'createdAt' | 'updatedAt' | 'userId' | 'isCompleted'
		>
	) => void
}

export function CreateTaskModal({ onCreateTask }: CreateTaskModalProps) {
	const initialTaskState = {
		title: '',
		description: '',
		importance: 'средняя',
		selectDay: 'Понедельник',
		subject: '',
		dueDate: '',
	}

	const [task, setTask] =
		useState<
			Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'userId' | 'isCompleted'>
		>(initialTaskState)
	const [isOpen, setIsOpen] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const dueDate = new Date(task.dueDate).toISOString()

			onCreateTask({ ...task, dueDate }) // Обновляем задачу в родительском компоненте
			setIsOpen(false)
			setTask(initialTaskState)
		} catch (error) {
			console.error('Ошибка создания задачи:', error)
		}
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setTask(prev => ({ ...prev, [name]: value }))
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Добавить задачу</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Создать новую задачу</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<Label htmlFor='title'>Название</Label>
						<Input
							id='title'
							name='title'
							value={task.title}
							onChange={handleChange}
							required
						/>
					</div>
					<div>
						<Label htmlFor='description'>Описание</Label>
						<Textarea
							id='description'
							name='description'
							value={task.description}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label htmlFor='importance'>Важность</Label>
						<Select
							value={task.importance}
							onValueChange={value =>
								setTask(prev => ({ ...prev, importance: value }))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='Выберите важность' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='низкая'>Низкая</SelectItem>
								<SelectItem value='средняя'>Средняя</SelectItem>
								<SelectItem value='высокая'>Высокая</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label htmlFor='selectDay'>День</Label>
						<Select
							value={task.selectDay}
							onValueChange={value =>
								setTask(prev => ({ ...prev, selectDay: value }))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='Выберите день' />
							</SelectTrigger>
							<SelectContent>
								{columns.map(
									column =>
										column.isDay && (
											<SelectItem key={column.id} value={column.title}>
												{column.title}
											</SelectItem>
										)
								)}
							</SelectContent>
						</Select>
					</div>
					<div>
						<Label htmlFor='subject'>Предмет</Label>
						<Input
							id='subject'
							name='subject'
							value={task.subject}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label htmlFor='dueDate'>Срок выполнения</Label>
						<Input
							type='date'
							id='dueDate'
							name='dueDate'
							value={task.dueDate}
							onChange={handleChange}
						/>
					</div>
					<DialogFooter>
						<Button
							type='button'
							variant='secondary'
							onClick={() => setIsOpen(false)}
						>
							Отмена
						</Button>
						<Button type='submit' variant='default'>
							Создать
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
