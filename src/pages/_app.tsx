import { ReduxProvider } from '@/state/Provider'
import { store } from '@/state/store'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import { UserFlow } from '@/flows/users'
import { IUser, User } from '@/domain/user'
import {
  setAllChats,
  setAllTeleports,
  setAllUsers,
  setCurrentUser,
} from '@/state/appData/appDataSlice'
import router from 'next/router'
import { Chat, IChat } from '@/domain/chat'
import { ChatFlow } from '@/flows/chat'
import { TeleportsFlow } from '@/flows/teleports'
import { ITeleport, Teleport } from '@/domain/teleports'
import Layout from '@/layout'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/users')
        const data = await res.json()

        const users: User[] = data.users
        UserFlow.userList = Array.from(new Set([...users])).reduce((acc, user) => {
          acc[user._id] = new User(user)
          return acc
        }, {} as Record<any, IUser>)

        store.dispatch(setAllUsers(data.users))

        const user = users[0]

        const test = UserFlow.userList[user._id]
      } catch (error) {
        console.log(error)
      }
    }
    const fetchAllChats = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/chats')
        const data = await res.json()

        const chats: Chat[] = data.chats

        ChatFlow.chatList = Array.from(new Set([...chats])).reduce((acc, chat) => {
          acc[chat._id] = new Chat(chat)
          return acc
        }, {} as Record<any, IChat>)

        store.dispatch(setAllChats(chats))
      } catch (error) {
        console.log(error)
      }
    }

    const fetchAllTeleports = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/teleports')
        const data = await res.json()

        const teleports: Teleport[] = data.teleports

        TeleportsFlow.teleportList = Array.from(new Set([...teleports])).reduce((acc, chat) => {
          acc[chat._id] = new Teleport(chat)
          return acc
        }, {} as Record<any, ITeleport>)

        store.dispatch(setAllTeleports(teleports))
      } catch (error) {
        console.log(error)
      }
    }

    fetchAllUsers()
    fetchAllChats()
    fetchAllTeleports()
  }, [])

  useEffect(() => {
    const fetchCurrentUser = async (userId: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/currentUser/${userId}`)
      const data = await res.json()

      const userLogged = new User({ ...data.user })

      store.dispatch(setCurrentUser(userLogged.toJSON()))

      const userLoggedToString = JSON.stringify(data.user)

      // localStorage.setItem('user', userLoggedToString)
    }
    const user = localStorage.getItem('user')

    if (user !== null) {
      const userParsed = JSON.parse(user)

      fetchCurrentUser(userParsed._id)
    } else {
      router.replace('/login')
    }
  }, [])

  return (
    <ReduxProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ReduxProvider>
  )
}
