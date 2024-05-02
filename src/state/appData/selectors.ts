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

export const getAllTeleports = (state: RootState) => {
  return state.appData.teleports
}

export const getChatById = (chatId: string | string[] | undefined) => {
  return createSelector([getAllChats], (chats) => {
    return chats.find((chat) => chat._id === chatId)
  })
}

export const getTeleportById = (teleportId: string | string[] | undefined) => {
  return createSelector([getAllTeleports], (teleports) => {
    return teleports.find((teleport) => teleport._id === teleportId)
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

export const getAllChatsCategories = (userId: string) => {
  return createSelector([getAllChats], (chats) => {
    return chats.filter((chat) => chat.category === userId).map((chat) => chat.category)
  })
}

export const getTeleportsAsCreator = (userId: string) => {
  return createSelector([getAllTeleports], (teleports) => {
    return teleports.filter((teleport) => teleport.creator === userId)
  })
}
