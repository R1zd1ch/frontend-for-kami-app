import ProfileMain from '@/components/profile/ProfileMain'
import { FC } from 'react'

interface pageProps {
	params: { id: string }
}

const page: FC<pageProps> = async () => {
	return (
		<div>
			<ProfileMain></ProfileMain>
		</div>
	)
}

export default page
