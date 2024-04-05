import Image from 'next/image'
import { Inter } from 'next/font/google'
import ChatPage from '@/components/ChatPage'
import { useEffect, useState } from 'react'
import { UserFlow } from '@/flows/users'
import { IUser, User } from '@/domain/user'
import { useDispatch } from 'react-redux'
import { setAllChats, setAllUsers, setCurrentUser } from '@/state/appData/appDataSlice'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '@/state/appData/selectors'
import router from 'next/router'
import HomeView from '@/views/home'
import { Chat, IChat } from '@/domain/chat'
import { ChatFlow } from '@/flows/chat'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const dispatch = useDispatch()
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

        dispatch(setAllUsers(data.users))

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
        console.log('chats', chats)

        ChatFlow.chatList = Array.from(new Set([...chats])).reduce((acc, chat) => {
          acc[chat._id] = new Chat(chat)
          return acc
        }, {} as Record<any, IChat>)

        dispatch(setAllChats(chats))
      } catch (error) {
        console.log(error)
      }
    }

    fetchAllUsers()
    fetchAllChats()
  }, [])

  useEffect(() => {
    const fetchCurrentUser = async (userId: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/currentUser/${userId}`)
      const data = await res.json()

      const userLogged = new User({ ...data.user })

      console.log('userLogged', userLogged)

      dispatch(setCurrentUser(userLogged.toJSON()))

      const userLoggedToString = JSON.stringify(data.user)

      localStorage.setItem('user', userLoggedToString)
    }
    const user = localStorage.getItem('user')

    if (user !== null) {
      const userParsed = JSON.parse(user)

      fetchCurrentUser(userParsed._id)
    } else {
      router.replace('/login')
    }
  }, [])

  const user = useSelector(getCurrentUser)
  return (
    <main>
      <HomeView />
    </main>
  )
}
