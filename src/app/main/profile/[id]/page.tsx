import ProfileMain from '@/components/profile/ProfileMain'
import { FC } from 'react'
export const dynamic = 'force-dynamic'

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
