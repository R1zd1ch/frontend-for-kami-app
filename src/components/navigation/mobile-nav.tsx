'use client'
import React, { useState } from 'react'
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import { Button } from '../ui/button'
import navItems, {
	LogoAndName,
	navMobileItems,
	navMobileItemsProps,
} from './data-naviagtion'

const rendernavMobileItems = (
	items: navMobileItemsProps[],
	user?: {
		username: string
		email: string
		avatar: string
		id: string
	}
) => {
	return items.map((item, index) => (
		<Link
			key={index}
			href={item.href}
			className='flex flex-col items-center relative'
		>
			{item.component && user ? (
				<item.component user={user} isSmall={true} />
			) : (
				<>
					<item.icon className='h-6 w-6' />
					{item.badge && (
						<Badge className='absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full'>
							{item.badge}
						</Badge>
					)}
				</>
			)}
		</Link>
	))
}
const renderBurgerMobileItems = (items: navMobileItemsProps[]) => {
	return items.map((item, index) => (
		<Link
			key={index}
			href={item.href}
			className='flex flex-col items-center relative'
		>
			<div className='flex flex-row items-center gap-4'>
				<item.icon className='h-8 w-8' />
				<p className='text-'>{item.label}</p>
			</div>
			{item.badge && (
				<Badge className='absolute -top-2 left-5 flex h-4 w-4 items-center justify-center rounded-full'>
					{item.badge}
				</Badge>
			)}
		</Link>
	))
}

export default function MobileNav({
	user,
}: {
	user: {
		username: string
		email: string
		avatar: string
		id: string
	}
}) {
	const [open, setOpen] = useState(false)

	return (
		<Card className='fixed bottom-0 left-0 right-0 p-0 md:hidden'>
			<CardContent className='flex justify-around items-center p-2 h-12 relative'>
				{/* @ts-expect-error: rendernavMobileItems expects user prop */}
				{rendernavMobileItems(navMobileItems.slice(0, 2), user)}
				<div className='w-3'></div>
				<Drawer open={open} onOpenChange={setOpen}>
					<DrawerTrigger asChild>
						<div className='absolute -bottom-4'>
							<Button
								variant='ghost'
								className='flex flex-col items-center bg-card w-12 h-12 rounded-t-3xl border-t-2 p-10'
							>
								<Menu style={{ width: '24px', height: '24px' }} />{' '}
								{/* Increased size */}
							</Button>
						</div>
					</DrawerTrigger>
					<DrawerContent className='flex flex-col px-6 space-y-5'>
						<DrawerTitle>
							<div className='flex items-center justify-center w-full'>
								<LogoAndName></LogoAndName>
							</div>
						</DrawerTitle>
						<div className=''>
							<nav className='flex flex-col gap-4 items-baseline flex-wrap h-[30vh]'>
								{renderBurgerMobileItems([...navItems, ...navMobileItems])}
							</nav>
						</div>
					</DrawerContent>
				</Drawer>
				{/* @ts-expect-error: rendernavMobileItems expects user prop */}
				{rendernavMobileItems(navMobileItems.slice(2), user)}
			</CardContent>
		</Card>
	)
}
