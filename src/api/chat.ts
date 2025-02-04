'use server'
import api from './serverApi'

export const getChats = async (userId: string) =>
	await api.get(`chat/${userId}`).then(res => res.data)

export const getMessages = async (
	chatId: string,
	userId: string,
	page: number
) =>
	await api
		.get(`chat/messages/${chatId}/${userId}?page=${page}`)
		.then(res => res.data)

export const createGroupChat = async (
	userId: string,
	name: string,
	userIds: string[]
) => await api.post(`chat/group/${userId}`, { name, userIds })

export const createPrivateChat = async (userId1: string, userId2: string) => {
	return await api.post(`chat/private/${userId1}/${userId2}`)
}
