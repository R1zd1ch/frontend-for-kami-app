'use client'
import Link from 'next/link'
import React from 'react'
import { Badge } from '../ui/badge'
import navItems, { LogoAndName, NavItemsProps } from './data-naviagtion'
import { ModeToggle } from '../ui/theme-toggle'
import NavUser from './nav-user'
import useSidebarStore from '@/storage/countSidebar'

const renderNavItems = (
	items: NavItemsProps[],
	dataForBadge: { [key: string]: number | null }
) => {
	return items.map((item, index) => (
		<Link
			key={index}
			href={item.href}
			className='flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary'
		>
			<item.icon className='h-6 w-6' />
			<p className='text-sm lg:text-base'>{item.label}</p>
			{item.badge && !dataForBadge[item.label] && (
				<Badge className='ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
					<p className='text-xs font-bold'>{item.badge}</p>
				</Badge>
			)}
			{!item.badge && (dataForBadge[item.label] ?? 0) > 0 && (
				<Badge className='ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full'>
					<p className='text-xs font-bold'>{dataForBadge[item.label]}</p>
				</Badge>
			)}
		</Link>
	))
}

export default function Sidebar({
	// dataForBadge,
	user,
}: {
	user: { username: string; email: string; avatar: string; id: string }
	// dataForBadge: {
	// 	[key: string]: number | string
	// }
}) {
	console.log(user)
	const { itemLengths } = useSidebarStore()
	const dataForBadge = itemLengths

	return (
		<aside className='hidden border-r bg-muted/40 md:block'>
			<div className='flex h-full max-h-screen flex-col gap-2'>
				<div className='flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6'>
					<div className='flex items-center justify-center w-full'>
						<LogoAndName></LogoAndName>
						{/* <Button variant='outline' size='icon' className='ml-auto h-8 w-8'>
						<Bell className='h-4 w-4' />
						<span className='sr-only'>Toggle notifications</span>
					</Button> */}
						<div className='ml-auto h-8 w-8'>
							<ModeToggle></ModeToggle>
						</div>
					</div>
				</div>
				<div className='flex-1'>
					<nav className='grid items-start px-2 text-sm font-medium lg:px-4'>
						<div className='grid grid-cols-1 gap-2 text-lg'>
							<div>
								<p>Задачи и зметки</p>
								{renderNavItems(navItems.slice(0, 2), dataForBadge)}
							</div>
							<div>
								<p>Личные интересы</p>
								{renderNavItems(navItems.slice(2, 5), dataForBadge)}
							</div>
							<div>
								<p>Коммуникация</p>
								{renderNavItems(navItems.slice(5, 7), dataForBadge)}
							</div>
							<div>
								<p>Развлечение</p>
								{renderNavItems(navItems.slice(7, 8), dataForBadge)}
							</div>
						</div>
					</nav>
				</div>
				<div className='mt-auto p-2'>
					{/* <Card x-chunk='dashboard-02-chunk-0'>
						<CardHeader className='p-2 pt-0 md:p-4'>
							<CardTitle>Upgrade to Pro</CardTitle>
							<CardDescription>
								Unlock all features and get unlimited access to our support
								team.
							</CardDescription>
						</CardHeader>
						<CardContent className='p-2 pt-0 md:p-4 md:pt-0'>
							<Button size='sm' className='w-full'>
								Upgrade
							</Button>
						</CardContent>
					</Card> */}

					<NavUser
						user={{
							name: user.username,
							email: user.email,
							avatar: user.avatar,
							id: user.id,
						}}
					></NavUser>
				</div>
			</div>
		</aside>
	)
}
