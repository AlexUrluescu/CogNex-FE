import { IChat } from '@/domain/chat'
import { ITeleport } from '@/domain/teleports'
import { IUser2 } from '@/domain/user'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IAppDataState {
  currentUser: IUser2
  users: IUser2[]
  chats: IChat[]
  teleports: ITeleport[]
}

const initialState: IAppDataState = {
  currentUser: {
    _id: '',
    email: '',
    files: [],
    firstName: '',
    lastName: '',
    age: '',
    password: '',
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

    setAllTeleports: (state, action: PayloadAction<ITeleport[]>) => {
      state.teleports = action.payload
    },

    updateChatById(state, action: { type: string; payload: IChat }) {
      const chatUpdated = action.payload
      state.chats = state.chats.map((chat) => (chat._id === chatUpdated._id ? chatUpdated : chat))
    },
    addNewChat: (state, action: PayloadAction<IChat>) => {
      state.chats.push(action.payload)
    },

    addNewTeleport: (state, action: PayloadAction<ITeleport>) => {
      state.teleports.push(action.payload)
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
  addNewChat,
  addNewTeleport,
  resetCurrentUser,
} = appDataSlice.actions
export default appDataSlice.reducer
