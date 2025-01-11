import { FC } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'

interface WelcomePageProps {
	session: {
		user: {
			id: string
			username: string
			email: string
			firstName: string
			lastName: string
			avatarUrl: string
		} | null
		tokens: {
			accessToken: string
			refreshToken: string
		} | null
	} | null
}

const WelcomePage: FC<WelcomePageProps> = ({ session }) => {
	const ButtonsGroup = () => {
		return (
			<div className='flex flex-row gap-4 font-bold text-base'>
				<Link href={'/auth/signin'}>
					<Button size={'lg'}>Войти</Button>
				</Link>
				<Link href='/auth/signup'>
					<Button size={'lg'}>Зарегистрироваться</Button>
				</Link>
			</div>
		)
	}

	return (
		<div className='h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-br from-primary to-primary/50 text-white'>
			<div className='h-[75vh] w-[90vw] my-3 mx-3 bg-white bg-opacity-10 backdrop-blur-md rounded-3xl flex flex-row items-center p-8 gap-20'>
				{/* Для картиночкее */}
				<div className='w-1/2 bg-gradient-to-br from-primary to-primary/50 h-full rounded-3xl m-4 shadow-lg'></div>
				<div className='w-1/2 flex flex-col items-start justify-center'>
					<h1 className='text-5xl font-bold mb-1'>
						Добро пожаловать в SphereFusion
					</h1>
					<p className='text-xl mb-3 text-center'>
						Приложение чтобы знать больше о вашем партнёре
					</p>
					<div className=''>
						{session?.user && (
							<div>
								<p className='mb-2'>
									Вы авторизированы как: @{session.user.username}
								</p>
								<Link href={'/main'} className=''>
									<Button className='font-bold text-base' size={'lg'}>
										Продолжить
									</Button>
								</Link>
							</div>
						)}
						{!session?.user && <ButtonsGroup />}
					</div>
				</div>
			</div>
			<div className='mt-8'>
				<ChevronDown
					style={{ width: '60px', height: '60px' }}
					className='animate-bounce'
				/>
			</div>
		</div>
	)
}

export default WelcomePage
