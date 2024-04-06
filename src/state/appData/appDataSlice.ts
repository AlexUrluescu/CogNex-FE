import { IChat } from '@/domain/chat'
import { IUser, IUser2, User } from '@/domain/user'
import { UserFlow } from '@/flows/users'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IAppDataState {
  currentUser: IUser2
  users: IUser[]
  chats: IChat[]
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
}

const appDataSlice = createSlice({
  name: 'appData',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<IUser2>) => {
      state.currentUser = action.payload
    },
    setAllUsers: (state, action: PayloadAction<IUser[]>) => {
      state.users = action.payload
    },
    setAllChats: (state, action: PayloadAction<IChat[]>) => {
      state.chats = action.payload
    },
    addNewChat: (state, action: PayloadAction<IChat>) => {
      state.chats.push(action.payload)
    },

    resetCurrentUser: (state, action: PayloadAction<IUser2>) => {
      state.currentUser = action.payload
    },
  },
})

export const { setCurrentUser, setAllUsers, setAllChats, addNewChat, resetCurrentUser } =
  appDataSlice.actions
export default appDataSlice.reducer
