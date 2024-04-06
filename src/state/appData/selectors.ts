import { UserFlow } from '@/flows/users'
import { RootState } from '../store'
import { createSelector } from '@reduxjs/toolkit'

export const getCurrentUser = (state: RootState) => {
  return state.appData.currentUser
}

export const getAllUsers = (state: RootState) => {
  return state.appData.users
}

export const getAllChats = (state: RootState) => {
  return state.appData.chats
}

export const getChatById = (chatId: string | string[] | undefined) => {
  return createSelector([getAllChats], (chats) => {
    return chats.find((chat) => chat._id === chatId)
  })
}

export const getUserById = (userId: string | string[] | undefined) => {
  return createSelector([getAllUsers], (users) => {
    return users.find((user) => user._id === userId)
  })
}

export const getChatsAsCreator = (userId: string) => {
  return createSelector([getAllChats], (chats) => {
    return chats.filter((chat) => chat.creator === userId)
  })
}
