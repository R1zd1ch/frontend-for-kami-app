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
import { SignInSchema } from '@/schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { z } from 'zod'
import { useFormStatus } from 'react-dom'
import { useState } from 'react'
import { signIn } from 'next-auth/react'

const SignInForm = ({}) => {
	const [loading, setLoading] = useState(false)

	const form = useForm({
		resolver: zodResolver(SignInSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	})

	const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
		setLoading(true)
		console.log(data)
		const result = await signIn('credentials', {
			redirect: true,
			callbackUrl: '/main',
			username: data.username,
			password: data.password,
		})
		if (result?.error) {
			console.log(result.error)
			setLoading(false)
		}
	}

	const { pending } = useFormStatus()

	return (
		<CardWrapper
			lable='Войдите в аккаунт'
			title='Авторизация'
			backButtonHref='/auth/signup'
			backButtonLabel='Нет аккаунта? Зарегистрируйтесь здесь.'
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
					<div className='space-y-4'>
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
											type='text'
											placeholder='example@email.com'
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
					</div>
					<Button type='submit' className='w-full' disabled={pending}>
						{loading ? 'Загрузка...' : 'Войти'}
					</Button>
				</form>
			</Form>
		</CardWrapper>
	)
}

export default SignInForm
