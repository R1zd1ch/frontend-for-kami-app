import { fetchProfile } from '@/api/fetchprofile'
import ProfileHeader from '@/components/profile/ProfileHeader'
import { UserProfile } from '@/lib/types'
export const dynamic = 'force-dynamic'
import getSession from '@/lib/getSession'

export default async function Layout({
	children,
}: {
	children: React.ReactNode
}) {
	const session = await getSession()
	const id = session?.user.id
	const profile: UserProfile = await fetchProfile(id || '')

	return (
		<div className='w-full h-[95vh]'>
			<ProfileHeader profile={profile} />
			{children}
		</div>
	)
}
