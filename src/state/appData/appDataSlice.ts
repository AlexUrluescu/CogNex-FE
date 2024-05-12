import { IChat } from '@/domain/chat'
import { ITeleport, ITeleport2 } from '@/domain/teleports'
import { IUser2 } from '@/domain/user'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IAppDataState {
  currentUser: IUser2
  users: IUser2[]
  chats: IChat[]
  teleports: ITeleport2[]
}

const initialState: IAppDataState = {
  currentUser: {
    _id: '',
    email: '',
    files: [],
    name: '',
    age: '',
    photo: '',
  },
  users: [],
  chats: [],
  teleports: [],
}

const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<IUser2>) => {
      state.currentUser = action.payload
    },
    setAllUsers: (state, action: PayloadAction<IUser2[]>) => {
      state.users = action.payload
    },
    setAllChats: (state, action: PayloadAction<IChat[]>) => {
      state.chats = action.payload
    },

    setAllTeleports: (state, action: PayloadAction<ITeleport2[]>) => {
      state.teleports = action.payload
    },

    updateChatById(state, action: { type: string; payload: IChat }) {
      const chatUpdated = action.payload
      state.chats = state.chats.map((chat) => (chat._id === chatUpdated._id ? chatUpdated : chat))
    },
    updateTeleportById(state, action: { type: string; payload: ITeleport2 }) {
      const teleportUpdated = action.payload
      state.teleports = state.teleports.map((teleport) =>
        teleport._id === teleportUpdated._id ? teleportUpdated : teleport
      )
    },
    addNewChat: (state, action: PayloadAction<IChat>) => {
      state.chats.push(action.payload)
    },

    addNewTeleport: (state, action: PayloadAction<ITeleport2>) => {
      state.teleports.push(action.payload)
    },

    deleteTeleport(state, action: { type: string; payload: string }) {
      state.teleports = state.teleports.filter((teleport) => teleport._id !== action.payload)
    },

    deleteChat(state, action: { type: string; payload: string }) {
      state.chats = state.chats.filter((chat) => chat._id !== action.payload)
    },

    resetCurrentUser: (state, action: PayloadAction<IUser2>) => {
      state.currentUser = action.payload
    },
  },
})

export const {
  setCurrentUser,
  setAllUsers,
  setAllChats,
  setAllTeleports,
  updateChatById,
  updateTeleportById,
  addNewChat,
  addNewTeleport,
  deleteTeleport,
  deleteChat,
  resetCurrentUser,
} = appDataSlice.actions
export default appDataSlice.reducer
