'use client'

import CardWrapper from './CardWrapper'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { SignUpSchema } from '@/schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { z } from 'zod'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'
import { BACKEND_URL } from '@/lib/constants'
import { signIn } from 'next-auth/react'

const SignUpForm = ({}) => {
	const [loading, setLoading] = useState(false)

	const form = useForm({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			email: '',
			username: '',
			password: '',
			confirmPassword: '',
		},
	})

	const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
		setLoading(true)
		console.log(data)
		const res = await fetch(`${BACKEND_URL}/auth/signup`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email: data.email,
				username: data.username,
				password: data.password,
			}),
		})
		const result = await res.json()
		console.log(result)
		setLoading(false)

		signIn('credentials', {
			redirect: true,
			callbackUrl: '/main',
			username: data.username,
			password: data.password,
		})

		if (result?.error) {
			console.log(result.error)
		}
	}

	const { pending } = useFormStatus()

	return (
		<CardWrapper
			lable='Создайте аккаунт'
			title='Регистрация'
			backButtonHref='/auth/signin'
			backButtonLabel='Есть аккаунт? Авторизируйтесь здесь.'
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor='email'>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											id='email'
											type='email'
											placeholder='example@email.com'
										></Input>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>
						<FormField
							control={form.control}
							name='username'
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor='username'>Username</FormLabel>
									<FormControl>
										<Input
											{...field}
											id='username'
											type='username'
											placeholder='example1234'
										></Input>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor='password'>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											id='password'
											type='password'
											placeholder='********'
										></Input>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>
						<FormField
							control={form.control}
							name='confirmPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel htmlFor='confirmPassword'>
										Confirm Password
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											id='confirmPassword'
											type='password'
											placeholder='********'
										></Input>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						></FormField>
					</div>
					<Button type='submit' className='w-full' disabled={pending}>
						{loading ? 'Загрузка...' : 'Зарегистрироваться'}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}

export default SignUpForm
