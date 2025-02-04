'use client'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from './ui/button'
import Link from 'next/link'

const SignInButton = () => {
	const { data: session } = useSession()
	// console.log(session)
	if (session && session.user) {
		return (
			<Link href={'/api/auth/signout'}>
				<Button onClick={() => signOut()}>SignOut</Button>
			</Link>
		)
	}

	return (
		<div className='flex flex-row gap-4'>
			<Link href={'/api/auth/signin'}>
				<Button>Войти</Button>
			</Link>
			<Link href='/signup'>
				<Button>Зарегистрироваться</Button>
			</Link>
		</div>
	)
}

export default SignInButton
