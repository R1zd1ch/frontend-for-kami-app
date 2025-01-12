import { fetchProfile } from '@/api/fetchprofile'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import ProfileHeader from '@/components/profile/ProfileHeader'
import { UserProfile } from '@/lib/types'
export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'

export default async function Layout({
	children,
	params,
}: {
	children: React.ReactNode
	params: { id: string }
}) {
	const session = await getServerSession(authOptions)
	const token = session?.tokens.accessToken
	const { id } = await params
	const profile: UserProfile = await fetchProfile(id, (token as string) || '')

	return (
		<div className='w-full h-[95vh]'>
			<ProfileHeader profile={profile} />
			{children}
		</div>
	)
}
