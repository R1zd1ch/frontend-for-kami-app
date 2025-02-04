import DialogWindow from '@/components/messages/DialogWindow'
import getSession from '@/lib/getSession'

const page = async ({ params }: { params: { chatRoomId: string } }) => {
	const chatRoomId = (await params).chatRoomId
	const session = await getSession()

	return (
		<DialogWindow
			chatRoomId={chatRoomId}
			userId={session?.user.id}
		></DialogWindow>
	)
}

export default page
