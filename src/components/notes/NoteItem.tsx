'use client'
import { Note } from '@/lib/types'
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from '../ui/card'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Pin, PinOff, Trash } from 'lucide-react'
import { EditNoteModal } from './EditNoteModal'

import {
	DialogDescription,
	DialogHeader,
	DialogTrigger,
	Dialog,
	DialogContent,
	DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { useState } from 'react'

interface NoteItemProps {
	note: Note
	onPinNote: (note: Note) => Promise<void>
	onUpdateNote: (note: Note) => Promise<void>
	onDeleteNote: (noteId: string) => Promise<void>
}
const addDaySuffix = (day: number) => {
	const suffix = day === 1 || day > 20 ? 'й' : 'го'
	return `${day}${suffix}`
}

const NoteItem = ({
	note,
	onPinNote,
	onUpdateNote,
	onDeleteNote,
}: NoteItemProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const day = format(note.createdAt, 'd')
	const formattedDay = addDaySuffix(Number(day))
	const formattedTags = note.tags?.split(',').map(tag => `#${tag}`)
	// console.log(formattedTags)
	return (
		<Card className='p-4 shadow-md hover:shadow-lg'>
			<div className='flex flex-row justify-between'>
				<div className='col-span-5'>
					<CardTitle className='text-lg font-bold line-clamp-1 whitespace-normal'>
						{note.title}
					</CardTitle>
					<CardDescription className='text-sm line-clamp-1'>
						<p>
							{formattedDay}{' '}
							{format(note.createdAt, 'MMM yyyy', { locale: ru })}
						</p>
					</CardDescription>
				</div>
				<div
					className='h-fit w-fit'
					onClick={() => {
						onPinNote(note)
					}}
				>
					{note.isPinned && (
						<Pin className='text-primary hover:text-primary/50'></Pin>
					)}
					{!note.isPinned && (
						<PinOff className='text-muted-foreground hover:text-primary/50'></PinOff>
					)}
				</div>
			</div>
			<CardContent className='p-0 mt-2 text-neutral-600 dark:text-neutral-50 line-clamp-1 w-10/12'>
				{note.content}
			</CardContent>
			<CardFooter className='p-0 mt-2 flex flex-row justify-between items-end'>
				<div className='flex flex-wrap gap-1 '>
					{formattedTags &&
						[...formattedTags].map(tag => (
							<span
								key={tag}
								className='mr-2 rounded bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200'
							>
								{tag}
							</span>
						))}
				</div>
				<div className='flex flex-row gap-4'>
					<EditNoteModal
						note={note}
						onUpdateNote={onUpdateNote}
					></EditNoteModal>
					<Dialog open={isOpen} onOpenChange={setIsOpen}>
						<DialogTrigger asChild>
							<Trash className='w-4 text-muted-foreground hover:text-primary'></Trash>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Хотите удалить заметку?</DialogTitle>
								<DialogDescription>
									Вы уверены, что хотите удалить заметку?
								</DialogDescription>
							</DialogHeader>
							<Button
								onClick={() => {
									onDeleteNote(note.id)
									setIsOpen(false)
								}}
							>
								Удалить
							</Button>
						</DialogContent>
					</Dialog>
				</div>
			</CardFooter>
		</Card>
	)
}

export default NoteItem
