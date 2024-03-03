import { IChat } from '@/domain/chat'
import { IUser, User } from '@/domain/user'
import { UserFlow } from '@/flows/users'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IAppDataState {
  currentUser: IUser
  users: IUser[]
  chats: IChat[]
}

const initialState: IAppDataState = {
  currentUser: {
    _id: undefined,
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
    setCurrentUser: (state, action: PayloadAction<IUser>) => {
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
  },
})

export const { setCurrentUser, setAllUsers, setAllChats, addNewChat } = appDataSlice.actions
export default appDataSlice.reducer
