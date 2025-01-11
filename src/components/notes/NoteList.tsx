'use client'
import { Note } from '@/lib/types'

import NoteItem from './NoteItem'

interface NoteListProps {
	initialNotes: Note[]
	onPinNote: (note: Note) => Promise<void>
	onUpdateNote: (note: Note) => Promise<void>
	onDeleteNote: (noteId: string) => Promise<void>
}

const NoteList = ({
	initialNotes,
	onPinNote,
	onUpdateNote,
	onDeleteNote,
}: NoteListProps) => {
	return (
		<div className='grid grid-cols-3 gap-4'>
			{initialNotes.map(note => (
				<div key={note.id}>
					<NoteItem
						note={note}
						onPinNote={onPinNote}
						onUpdateNote={onUpdateNote}
						onDeleteNote={onDeleteNote}
					></NoteItem>
				</div>
			))}
		</div>
	)
}

export default NoteList
