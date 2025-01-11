'use client'

import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import AuthHeader from './AuthHeader'
import BackButton from './BackButton'

interface CardWrapperProps {
	lable: string
	title: string
	backButtonHref: string
	backButtonLabel: string
	children: React.ReactNode
}

const CardWrapper = ({
	lable,
	title,
	backButtonHref,
	backButtonLabel,
	children,
}: CardWrapperProps) => {
	return (
		<Card className='xl:w-1/4 md:w-1/2 shadow-md'>
			<CardHeader>
				<AuthHeader label={lable} title={title}></AuthHeader>
			</CardHeader>
			<CardContent>{children}</CardContent>
			<CardFooter>
				<BackButton label={backButtonLabel} href={backButtonHref}></BackButton>
			</CardFooter>
		</Card>
	)
}

export default CardWrapper
