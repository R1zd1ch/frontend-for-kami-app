import * as z from 'zod'

export const SignUpSchema = z.object({
	email: z.string().email({ message: 'некорректный email' }),
	username: z
		.string({ message: 'некорректное имя пользователя' })
		.min(3, { message: 'имя пользователя должно быть не менее 3 символов' })
		.max(20, { message: 'имя пользователя должно быть не более 20 символов' }),
	password: z
		.string()
		.min(8)
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
			message:
				'пароль должен содержать минимум одну строчную букву, одну заглавную букву и одну цифру',
		}),
	confirmPassword: z
		.string()
		.min(8)
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
			message:
				'пароль должен содержать минимум одну строчную букву, одну заглавную букву и одну цифру',
		}),
})

// export const SignInSchema = z.object({
// 	email: z.string().email({ message: 'некорректный email' }),
// 	password: z
// 		.string()
// 		.min(8)
// 		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
// 			message:
// 				'пароль должен содержать минимум одну строчную букву, одну заглавную букву и одну цифру',
// 		}),
// })
export const SignInSchema = z.object({
	username: z
		.string()
		.min(3, { message: 'имя пользователя должно быть не менее 3 символов' }),
	password: z
		.string()
		.min(8)
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
			message:
				'пароль должен содержать минимум одну строчную букву, одну заглавную букву и одну цифру',
		}),
})
