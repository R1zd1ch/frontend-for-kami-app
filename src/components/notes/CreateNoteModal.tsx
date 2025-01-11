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
import { Textarea } from '@/components/ui/textarea'
import { Note } from '@/lib/types'

interface CreateNoteModalProps {
	onCreateNote: (
		note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
	) => void
}

export function CreateNoteModal({ onCreateNote }: CreateNoteModalProps) {
	const initialState = {
		title: '',
		content: '',
		tags: '',
		category: '',
		isPinned: false,
	}

	const [note, setNote] =
		useState<Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>(
			initialState
		)
	const [isOpen, setIsOpen] = useState(false)
	const [tagInput, setTagInput] = useState('')
	const [tags, setTags] = useState<string[]>([])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			onCreateNote({ ...note, tags: tags.join(',') }) //
			setIsOpen(false)
			setNote(initialState)
			setTags([])
			setTagInput('')
		} catch (error) {
			console.error('Ошибка создания заметки', error)
		}
	}

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target
		setNote(prevNote => ({ ...prevNote, [name]: value }))
	}

	const handleAddTag = () => {
		if (tagInput.trim() && !tags.includes(tagInput.trim())) {
			setTags(prevTags => [...prevTags, tagInput.trim()])
			setTagInput('') // Очищаем поле ввода
		}
	}

	const handleRemoveTag = (tag: string) => {
		setTags(prevTags => prevTags.filter(t => t !== tag))
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button>Добавить заметку</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Создание заметки</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<Label htmlFor='title'>Заголовок</Label>
						<Input
							id='title'
							name='title'
							value={note.title}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label htmlFor='content'>Содержание</Label>
						<Textarea
							id='content'
							name='content'
							value={note.content}
							onChange={handleChange}
						/>
					</div>
					<div>
						<Label htmlFor='tags'>Теги</Label>
						<div className='my-1 mb-2 flex flex-wrap gap-2'>
							{tags.map(tag => (
								<span
									key={tag}
									className='mr-2 rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200'
								>
									#{tag}
									<button className='ml-2' onClick={() => handleRemoveTag(tag)}>
										×
									</button>
								</span>
							))}
						</div>
						<div className='flex items-center gap-2'>
							<Input
								id='tags'
								value={tagInput}
								onChange={e => setTagInput(e.target.value)}
							/>
							<Button type='button' onClick={handleAddTag}>
								Добавить
							</Button>
						</div>
					</div>
					<DialogFooter>
						<Button type='submit'>Создать заметку</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
