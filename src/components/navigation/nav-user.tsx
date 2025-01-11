'use client'

import React, { useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	ChevronsUpDown,
	LogIn,
	LucideProps,
	User,
	UserRoundPlus,
	UserRoundX,
} from 'lucide-react'
import { menuItems } from './data-naviagtion'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { generateHref } from '@/lib/utils'

interface MenuItemProps {
	label: string
	onClick: () => void
	isSeparator?: boolean
	Icon: React.FC<LucideProps>
	href?: string
}

const renderMenuItems = (items: MenuItemProps[], id: string) => {
	return items.map((item, index) => (
		<div key={index}>
			{item.href ? (
				<Link
					href={`/main/${generateHref(item.href)}/${id}`}
					className='w-full'
				>
					{item.isSeparator && <DropdownMenuSeparator />}
					<DropdownMenuItem
						key={index}
						onClick={item.onClick}
						className='flex items-center gap-2'
					>
						<item.Icon style={{ width: '20px', height: '20px' }}></item.Icon>
						{item.label}
					</DropdownMenuItem>
				</Link>
			) : (
				<>
					{item.isSeparator && <DropdownMenuSeparator />}
					<DropdownMenuItem
						key={index}
						onClick={item.onClick}
						className='flex items-center gap-2'
					>
						<item.Icon style={{ width: '20px', height: '20px' }}></item.Icon>
						{item.label}
					</DropdownMenuItem>
				</>
			)}
		</div>
	))
}

export default function NavUser({
	user,
	isSmall,
}: {
	user: { name: string; email: string; avatar: string; id: string }
	isSmall?: boolean
}) {
	const [open, setOpen] = useState(false)
	const { data: session } = useSession()
	console.log(session)

	if (!session) {
		return (
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<Button
						variant='outline'
						size={isSmall ? 'sm' : 'lg'}
						className={`flex items-center w-full ${
							open ? 'bg-secondary' : ''
						} ${isSmall ? 'p-0' : 'py-8 px-4'}`}
					>
						{isSmall && (
							<UserRoundX style={{ width: '20px', height: '20px' }} />
						)}
						{!isSmall && (
							<>
								<Avatar className='h-10 w-10 rounded-lg'>
									<AvatarFallback className='rounded-lg'>
										<UserRoundX />
									</AvatarFallback>
								</Avatar>

								<p className='text-base'>Авторизируйтесь</p>
								<ChevronsUpDown className='ml-auto size-4' />
							</>
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align='end' side='left' sideOffset={4}>
					<div className='flex flex-col gap-1'>
						<Link href={'/auth/signin'} className='w-full h-full '>
							<DropdownMenuItem className='flex items-center gap-2 cursor-pointer p-2'>
								<div
									onClick={() => setOpen(false)}
									className='flex flex-row gap-2'
								>
									<LogIn style={{ width: '20px', height: '20px' }}></LogIn>
									Войти
								</div>
							</DropdownMenuItem>
						</Link>
						<Link href={'/auth/signup'} className='w-full'>
							<DropdownMenuItem className='flex items-center gap-2 cursor-pointer p-2'>
								<div
									onClick={() => setOpen(false)}
									className='flex flex-row gap-2'
								>
									<UserRoundPlus
										style={{ width: '20px', height: '20px' }}
									></UserRoundPlus>
									Зарегестрироваться
								</div>
							</DropdownMenuItem>
						</Link>
					</div>
				</DropdownMenuContent>
			</DropdownMenu>
		)
	}

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size={isSmall ? 'sm' : 'lg'}
					className={`flex items-center w-full  ${open ? 'bg-secondary' : ''} ${
						isSmall ? 'h-6 w-6' : 'py-8 px-4'
					}`}
				>
					{!isSmall && (
						<div className='flex items-center w-full'>
							<div className='flex items-center gap-4'>
								<Avatar className='h-10 w-10 rounded-lg'>
									<AvatarImage src={user.avatar} alt={user.name} />
									<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
								</Avatar>
								<div className='grid flex-1 text-left text-sm leading-tight'>
									<span className='truncate font-semibold text-base'>
										{user.name}
									</span>
									<span className='truncate text-xs'>{user.email}</span>
								</div>
							</div>
							<ChevronsUpDown className='ml-auto size-4' />
						</div>
					)}
					{isSmall && (
						<Avatar className='h-6 w-6 rounded-lg'>
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback className='bg-inherit'>
								<User></User>
							</AvatarFallback>
						</Avatar>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align={`${isSmall ? 'center' : 'end'}`}
				side={`${isSmall ? 'top' : 'left'}`}
				sideOffset={4}
			>
				<div className=''>
					<div className='flex items-center gap-2 p-1'>
						<Avatar className='h-10 w-10 rounded-lg'>
							<AvatarImage src={user.avatar} alt={user.name} />
							<AvatarFallback className='rounded-lg'>CN</AvatarFallback>
						</Avatar>
						<div className='grid flex-1 text-left text-sm leading-tight'>
							<span className='truncate font-semibold text-base'>
								{user.name}
							</span>
							<span className='truncate text-xs'>{user.email}</span>
						</div>
					</div>
					<DropdownMenuSeparator></DropdownMenuSeparator>

					{renderMenuItems(menuItems, user.id)}
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
