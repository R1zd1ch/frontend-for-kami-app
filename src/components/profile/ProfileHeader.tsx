'use client'
import React, { useEffect } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card'
import { UserProfile } from '@/lib/types'
import useProfileStore from '@/storage/profile'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

const buttonsSize = 'sm'
const buttonsClassName = 'text-sm sm:text-base'
const bgActiveButton = 'bg-secondary'

const ProfileHeader = ({ profile }: { profile: UserProfile }) => {
	const [activeButton, setActiveButton] = React.useState('profile')
	const { setProfile } = useProfileStore()

	useEffect(() => {
		setProfile(profile)
	}, [])

	return (
		<>
			<div className=''>
				<div className='p-4 sm:p-8 flex flex-col gap-4 items-end'>
					<Card className='w-full h-[20vh] sm:h-[25vh] relative flex justify-end'>
						<Button className='m-2 sm:m-4' size={'sm'}>
							Загрузить изображение
						</Button>
					</Card>
					<Card className='w-7/12 sm:w-fit p-2 sm:p-4'>
						<div className='flex flex-row flex-wrap sm:flex-row sm:justify-between gap-2 sm:gap-4'>
							<Link href={`/main/profile/${profile.id}`}>
								<Button
									size={buttonsSize}
									className={`${buttonsClassName} ${
										activeButton === 'profile' ? bgActiveButton : ''
									}`}
									onClick={() => setActiveButton('profile')}
								>
									Главная профиля
								</Button>
							</Link>
							<Link href={`/main/profile/${profile.id}/friends`}>
								<Button
									size={buttonsSize}
									className={`${buttonsClassName} ${
										activeButton === 'friends' ? bgActiveButton : ''
									}`}
									onClick={() => setActiveButton('friends')}
								>
									Друзья
								</Button>
							</Link>
							<Link href={`/main/profile/${profile.id}/photos`}>
								<Button
									size={buttonsSize}
									className={`${buttonsClassName} ${
										activeButton === 'photos' ? bgActiveButton : ''
									}`}
									onClick={() => setActiveButton('photos')}
								>
									Фото
								</Button>
							</Link>
							<Link href={`/main/profile/${profile.id}/settings`}>
								<Button
									size={buttonsSize}
									className={`${buttonsClassName} ${
										activeButton === 'settings' ? bgActiveButton : ''
									}`}
									onClick={() => setActiveButton('settings')}
								>
									Настройки
								</Button>
							</Link>

							<Button
								size={buttonsSize}
								className={`${buttonsClassName} ${
									activeButton === 'logout' ? bgActiveButton : ''
								}`}
								onClick={() =>
									signOut({
										callbackUrl: '/',
									})
								}
							>
								Выйти
							</Button>
						</div>
					</Card>
				</div>
				<CardHeader className='absolute top-28 sm:top-52 flex items-center sm:items-end gap-0 sm:gap-4 flex-col sm:flex-row pl-[5vw] sm:pl-[5vw]'>
					<Avatar className='h-24 w-24 sm:h-36 sm:w-36'>
						<AvatarImage src='/path/to/avatar.jpg' alt='User Avatar' />
						<AvatarFallback>U</AvatarFallback>
					</Avatar>
					<div className='flex flex-col items-start sm:items-start'>
						{!profile.lastName && !profile.firstName ? (
							<CardTitle className='text-2xl sm:text-3xl'>
								@{profile.username}
							</CardTitle>
						) : (
							<div className='flex flex-col items-start sm:items-start'>
								<CardTitle className='text-lg sm:text-xl'>
									{profile.firstName}
								</CardTitle>
								<CardTitle className='text-lg sm:text-xl'>
									{profile.lastName}
								</CardTitle>
								<CardDescription className='text-sm sm:text-md'>
									@{profile.username}
								</CardDescription>
							</div>
						)}
						<CardDescription className='text-xs sm:text-sm'>
							{profile.email}
						</CardDescription>
					</div>
				</CardHeader>
			</div>
		</>
	)
}

export default ProfileHeader
