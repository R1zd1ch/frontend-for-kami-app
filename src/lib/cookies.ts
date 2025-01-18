import {
	setCookie,
	deleteCookie,
	getCookies,
	getCookie,
} from 'cookies-next/client'

export function setCookies(name: string, value: string) {
	setCookie(name, value)
}

export function deleteCookies(name: string) {
	deleteCookie(name)
}

export function getCookieAAAA(name: string) {
	const cookies = getCookies()
	console.log('getCookie', cookies)
	return getCookie(name)
}
