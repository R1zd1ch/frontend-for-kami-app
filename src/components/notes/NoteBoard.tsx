'use client'
import { Note } from '@/lib/types'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import NoteList from './NoteList'
import { createNote, deleteNote, updateNote } from '@/api/notes'
import Fuse from 'fuse.js'
import { Input } from '../ui/input'
import { Frown, NotebookPen, Search } from 'lucide-react'
import { CreateNoteModal } from './CreateNoteModal'
import useSidebarStore from '@/storage/countSidebar'
import { toast } from 'sonner'

interface NoteBoardProps {
	id: string
	token: string
	initialNotes: Note[]
}

const NoteBoard = ({ id, token, initialNotes }: NoteBoardProps) => {
	const [notes, setNotes] = useState<Note[]>(
		[...initialNotes].sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
	)
	const [renderNotes, setRenderNotes] = useState<Note[]>(notes)
	const [select, setSelect] = useState('All')
	const [searchTerm, setSearchTerm] = useState('')

	const { incrementItemLength, decrementItemLength } = useSidebarStore()

	const fuse = new Fuse(notes, {
		keys: ['title', 'content', 'tags'],
		threshold: 0.3,
	})

	const handlePinNote = async (note: Note) => {
		setNotes(
			notes
				.map(n => (n.id === note.id ? { ...n, isPinned: !n.isPinned } : n))
				.sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
		)

		await updateNote(
			id,
			note.id,
			{
				...note,
				isPinned: !note.isPinned,
			},
			token
		)
		if (!note.isPinned) {
			toast('Заметка закреплена', {
				description: 'Заметка успешно закреплена',
				duration: 2000,
			})
		}

		if (note.isPinned) {
			toast('Заметка откреплена', {
				description: 'Заметка успешно откреплена',
				duration: 2000,
			})
		}
	}

	const handleCreateNote = async (
		note: Omit<Note, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
	): Promise<void> => {
		const createdNote = await createNote(id, note, token)
		setNotes([...notes, createdNote])
		toast('Заметка создана', {
			description: 'Заметка успешно создана',
			duration: 2000,
		})
		incrementItemLength('Заметки')
	}

	const handleUpdateNote = async (note: Note): Promise<void> => {
		const updatedNote = await updateNote(id, note.id, note, token)
		setNotes(notes.map(n => (n.id === note.id ? updatedNote : n)))
		toast('Заметка обновлена', {
			description: 'Заметка успешно обновлена',
			duration: 2000,
		})
	}

	const handleDeleteNote = async (noteId: string): Promise<void> => {
		try {
			const response = await deleteNote(id, noteId, token)
			if (response.status === 200) {
				console.log('Note deleted successfully')
			}
		} catch (error) {
			console.error('Error deleting note:', error)
		}
		setNotes(notes.filter(note => note.id !== noteId))
		toast('Заметка удалена', {
			description: 'Заметка успешно удалена',
			duration: 2000,
		})
		decrementItemLength('Заметки')
	}

	useEffect(() => {
		let filteredNotes = notes

		if (select === 'Pinned') {
			filteredNotes = notes.filter(note => note.isPinned)
		} else if (select === 'unPinned') {
			filteredNotes = notes.filter(note => !note.isPinned)
		}

		if (searchTerm.trim() !== '') {
			const normalizedSearch = searchTerm.trim().replace(/^#/, '')

			const searchResults = fuse
				.search(normalizedSearch)
				.map(result => result.item)

			filteredNotes = filteredNotes.filter(note => searchResults.includes(note))
		}

		setRenderNotes(filteredNotes)
	}, [select, notes, searchTerm])

	return (
		<div>
			{' '}
			<div className='flex flex-row justify-between items-center mb-4'>
				<div className='flex flex-row gap-4 items-center justify-center'>
					<div className='flex flex-row gap-2 items-center justify-center mb-4'>
						<NotebookPen></NotebookPen>
						<h1 className='text-2xl font-bold '>Мои заметки</h1>
					</div>
					<div className='flex flex-row gap-2 items-center justify-center'>
						<Button
							onClick={() => setSelect('All')}
							className={`${select === 'All' ? 'bg-primary' : 'bg-muted'}`}
						>
							Все
						</Button>
						<Button
							onClick={() => setSelect('Pinned')}
							className={`${select === 'Pinned' ? 'bg-primary' : 'bg-muted'}`}
						>
							Закреплённые
						</Button>
						<Button
							onClick={() => setSelect('unPinned')}
							className={`${select === 'unPinned' ? 'bg-primary' : 'bg-muted'}`}
						>
							Не закреплённые
						</Button>
					</div>
					<div className='mb-2'>
						<Input
							type='text'
							placeholder='Поиск заметок...'
							value={searchTerm}
							className='ml-2 w-[20vw]'
							onChange={e => setSearchTerm(e.target.value)}
						/>
					</div>
				</div>
				<div className='mb-4'>
					<CreateNoteModal onCreateNote={handleCreateNote}></CreateNoteModal>
				</div>
			</div>
			{notes.length > 0 ? (
				renderNotes.length > 0 ? (
					<NoteList
						initialNotes={renderNotes}
						onPinNote={handlePinNote}
						onUpdateNote={handleUpdateNote}
						onDeleteNote={handleDeleteNote}
					/>
				) : (
					// Если заметок нет
					<div className='flex flex-col items-center justify-center text-center mt-8'>
						<Search className='w-16 h-16 text-muted mb-4' />
						<p className='text-lg text-muted'>
							Нет заметок, соответствующих вашему запросу.
						</p>
					</div>
				)
			) : (
				<div className='flex flex-col items-center justify-center text-center mt-8'>
					<Frown className='w-16 h-16 text-muted mb-4' />
					<p className='text-lg text-muted'>У вас пока нет заметок</p>
				</div>
			)}
		</div>
	)
}

export default NoteBoard
