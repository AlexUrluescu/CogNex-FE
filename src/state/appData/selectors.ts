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

export const getChatsAsCreator = (userId: string) => {
  return createSelector([getAllChats], (chats) => {
    return chats.filter((chat) => chat.creator === userId)
  })
}
