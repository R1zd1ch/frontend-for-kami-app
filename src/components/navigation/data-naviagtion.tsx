import { Logo } from '@/lib/constants'
import {
	Book,
	Cat,
	Gift,
	ListChecks,
	LogOut,
	LucideProps,
	Mail,
	MessageSquareDot,
	NotebookPen,
	Settings,
	TvMinimalPlay,
	User,
} from 'lucide-react'
import Link from 'next/link'
import NavUser from './nav-user'
import { JSX } from 'react'
import { logout } from '@/lib/auth'

const navItems = [
	{ href: '/main/tasks', icon: ListChecks, label: 'Задачи', badge: null },
	{ href: '/main/notes', icon: NotebookPen, label: 'Заметки', badge: null },
	{ href: '/main/mood', icon: Cat, label: 'Настроение', badge: null },
	{ href: '/main/books', icon: Book, label: 'Книги', badge: null },

	{ href: '#', icon: Gift, label: 'Wish Лист', badge: null },
	{ href: '#', icon: Mail, label: 'Сообщения', badge: null },
	{ href: '#', icon: MessageSquareDot, label: 'Уведомления', badge: null },
	{ href: '#', icon: TvMinimalPlay, label: 'Планы к просмотру', badge: null },
]

export default navItems

export interface NavItemsProps {
	href: string
	icon: React.FC<LucideProps>
	badge: number | null
	label: string
}

export const menuItems = [
	{
		label: 'Profile',
		Icon: User,
		onClick: () => console.log('Profile clicked'),
		href: '/profile',
	},
	{
		label: 'Settings',
		Icon: Settings,
		onClick: () => console.log('Settings clicked'),
		href: '/profile/settings',
	},
	{
		label: 'Logout',
		Icon: LogOut,
		onClick: async () => await logout(),
		isSeparator: true,
	},
]

export const navMobileItems = [
	{ href: '#', icon: User, label: 'Профиль', badge: null, component: NavUser },
	{ href: '#', icon: Mail, label: 'Сообщения', badge: 6 },
	{ href: '#', icon: Cat, label: 'Настроение', badge: null },
	{ href: '#', icon: Settings, label: 'Настройки', badge: null },
]

export interface navMobileItemsProps {
	href: string
	icon: React.ForwardRefExoticComponent<
		React.PropsWithoutRef<LucideProps> & React.RefAttributes<SVGSVGElement>
	>
	badge: number | null
	label: string
	component?: ({
		user,
		isSmall,
	}: {
		user: { username: string; email: string; avatar: string; id: string }
		isSmall: boolean
	}) => JSX.Element
}

export const LogoAndName = ({ className }: { className?: string }) => {
	return (
		<Link
			href='/main'
			className={`flex justify-center items-center gap-2 font-semibold ${className}`}
		>
			<Logo width={40} height={40} />
			<h1 className='text-xl font-semibold '>SphereFusion</h1>
		</Link>
	)
}
