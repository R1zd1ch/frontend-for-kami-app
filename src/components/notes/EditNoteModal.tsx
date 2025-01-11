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
import { Pencil } from 'lucide-react'

interface EditNoteModalProps {
	note: Note
	onUpdateNote: (note: Note) => Promise<void>
}

export function EditNoteModal({ note, onUpdateNote }: EditNoteModalProps) {
	const [title, setTitle] = useState(note.title)
	const [content, setContent] = useState(note.content)
	const [tagInput, setTagInput] = useState('')
	const [tags, setTags] = useState<string[]>(note?.tags?.split(',') || [])
	const [isOpen, setIsOpen] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			onUpdateNote({
				...note,
				isPinned: note.isPinned,
				title,
				content,
				tags: tags.join(','),
			})
			setIsOpen(false)
		} catch (error) {
			console.error('Ошибка редактирования заметки', error)
		}
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Pencil className='w-4 text-muted-foreground hover:text-primary'></Pencil>
			</DialogTrigger>
			<DialogContent className=''>
				<DialogHeader>
					<DialogTitle>Редактировать заметку</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit} className='space-y-4'>
					<div>
						<Label>Заголовок</Label>
						<Input
							id='title'
							name='title'
							value={title}
							onChange={e => setTitle(e.target.value)}
						/>
					</div>
					<div>
						<Label>Содержание</Label>
						<Textarea
							id='content'
							name='content'
							value={content}
							onChange={e => setContent(e.target.value)}
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
									<button
										className='ml-2'
										onClick={() => setTags(tags.filter(t => t !== tag))}
									>
										×
									</button>
								</span>
							))}
						</div>
						<div className='flex items-center gap-2'>
							<Input
								id='tags'
								name='tags'
								value={tagInput}
								onChange={e => setTagInput(e.target.value)}
							/>
							<Button
								type='button'
								onClick={() => {
									if (tagInput) {
										setTags([...tags, tagInput])
										setTagInput('')
									}
								}}
							>
								Добавить
							</Button>
						</div>
					</div>
					<DialogFooter>
						<Button type='submit'>Сохранить</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	)
}
