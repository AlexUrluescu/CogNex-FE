import { IUser, User } from '@/domain/user'
import { RegisterFlow } from '@/flows/register'
import {
  setAllChats,
  setAllTeleports,
  setAllUsers,
  setCurrentUser,
} from '@/state/appData/appDataSlice'
import { store } from '@/state/store'
import { Button, Flex, Input, Modal, Select } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { auth, provider } from '@/googleSignIn'
import { signInWithPopup } from 'firebase/auth'
import TextArea from 'antd/es/input/TextArea'
import { categoryOptions, countryOptions, occupationOptions } from '@/utils'
import { UserFlow } from '@/flows/users'
import { TeleportsFlow } from '@/flows/teleports'
import { ITeleport, Teleport } from '@/domain/teleports'
import { Chat, IChat } from '@/domain/chat'
import { ChatFlow } from '@/flows/chat'

interface IForm {
  email: string
  password: string
}

const initialFormValues = {
  email: '',
  password: '',
}

type ICcontentRegisterForm = {
  name: string
  email: string
  age: string
  photo: string
  description: string
  ocupation: string
  country: string
}

const initialContentRegisterForm = {
  name: '',
  email: '',
  age: '',
  photo: '',
  description: '',
  ocupation: '',
  country: '',
}

interface IUserLogin {
  name: string
  email: string
  photo: string
}

const Login = () => {
  const [inputs, setInputs] = useState<IForm>(initialFormValues)
  const router = useRouter()
  const [contentRegisterForm, setContentRegisterForm] = useState<ICcontentRegisterForm>(
    initialContentRegisterForm
  )

  const [user, setUser] = useState<IUserLogin>({ name: '', email: '', photo: '' })
  const [showRegisterModal, setShowRegisterModal] = useState<any>()

  const handleRegisterFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setContentRegisterForm({ ...contentRegisterForm, [name]: value })
  }

  const handleLogin = async (e: any) => {
    e.preventDefault()
    const loggedUser: IUser = await RegisterFlow.loginUser(inputs)

    if (loggedUser !== undefined) {
      router.push('/')
    }

    const loggedUserSerialized = JSON.stringify(loggedUser)

    const userLogged = new User({ ...loggedUser })

    store.dispatch(setCurrentUser(userLogged.toJSON()))

    localStorage.setItem('user', loggedUserSerialized)
  }

  const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs({ ...inputs, [name]: value })
  }

  const handleGoogle = async () => {
    const data = await signInWithPopup(auth, provider)
    const dataUser = data.user
    const t = { email: dataUser.email }

    if (data.user.displayName === null || data.user.email === null || data.user.photoURL === null) {
      return
    }
    setUser({ name: data.user.displayName, email: data.user.email, photo: data.user.photoURL })

    // const t = { email: user.email }

    // console.log('t', t)

    const loggedUser = await RegisterFlow.loginUser2(t)

    if (loggedUser === undefined) {
      setContentRegisterForm({
        ...contentRegisterForm,
        name: data.user.displayName,
        email: data.user.email,
        photo: data.user.photoURL,
      })
      setShowRegisterModal(true)
    } else {
      const loggedUserSerialized = JSON.stringify(loggedUser)
      localStorage.setItem('user', loggedUserSerialized)
      const user = new User({ ...loggedUser })
      store.dispatch(setCurrentUser(user.toJSON()))
      router.push('/')
    }
  }

  const handleOk = () => {
    setShowRegisterModal(false)
  }

  const handleCancel = () => {
    setShowRegisterModal(false)
  }

  const fetchAllUsers = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/users')
      const data = await res.json()

      const users: User[] = data.users
      UserFlow.userList = Array.from(new Set([...users])).reduce((acc, user) => {
        acc[user._id] = new User(user)
        return acc
      }, {} as Record<any, IUser>)

      console.log('se fac allusers')

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

      console.log('intra2')

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

  const handleRegisterFormSubmit = async (e: any) => {
    e.preventDefault()

    const newUser = await RegisterFlow.registerNewUser(contentRegisterForm)

    if (newUser !== undefined) {
      console.log('newUser', newUser.user)
      const test = {
        _id: '662f7709b186052514e6649a',
        name: 'alex',
        email: 'alerurluescu23@gmail.com',
        photo:
          'https://lh3.googleusercontent.com/a/ACg8ocJDXMXjAyODw6oiQOyq5SSczrLbO1dexM5gJpAWFr_xOy2Kig=s96-c',
        age: '21',
      }
      const userStringify = JSON.stringify(newUser.user)
      localStorage.setItem('user', userStringify)
      const user = new User({ ...newUser.user })
      console.log('user', user)
      fetchAllUsers()
      fetchAllChats()
      fetchAllTeleports()

      store.dispatch(setCurrentUser(user.toJSON()))
      router.push('/')
      setContentRegisterForm(initialContentRegisterForm)
    }
  }

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const handleChangeOcupation = (value: string) => {
    setContentRegisterForm({ ...contentRegisterForm, ocupation: value })
  }

  const handleChangeCountry = (value: string) => {
    setContentRegisterForm({ ...contentRegisterForm, country: value })
  }

  // const handleChangeCountry = (value: string) => {
  //   setContentRegisterForm({ ...contentRegisterForm, country: value })
  // }

  if (user === undefined) {
    return
  }

  return (
    <Flex
      justify="center"
      align="start"
      style={{
        // backgroundColor: 'blue',
        height: '100vh',
      }}
    >
      <Flex
        vertical
        justify="space-evenly"
        align="center"
        style={{
          borderRadius: 10,
          backgroundColor: 'white',
          border: '1px solid #F1F0F0',
          width: 400,
          height: 400,
        }}
      >
        <h2>Welcome in Teleport</h2>
        <Flex vertical gap={15}>
          <h3 style={{ fontWeight: 500 }}>Sign in with</h3>

          <Button type="primary" onClick={handleGoogle}>
            Google
          </Button>
        </Flex>
      </Flex>

      <Modal width={800} title="Personal details" open={showRegisterModal}>
        <form onSubmit={handleRegisterFormSubmit}>
          <Flex vertical gap={10}>
            <Flex align="center">
              <span style={{ width: '15%' }}>Name:</span>
              <Input
                onChange={handleRegisterFormChange}
                name="name"
                placeholder="name"
                value={user.name}
                disabled={true}
              />
            </Flex>
            <Flex align="center">
              <span style={{ width: '15%' }}>Email:</span>

              <Input
                style={{ marginLeft: 2 }}
                onChange={handleRegisterFormChange}
                name="email"
                placeholder="email"
                value={user.email}
                disabled={true}
              />
            </Flex>
            <Flex align="center">
              <span style={{ width: '15%' }}>Age:</span>

              <Input
                // style={{ marginLeft: 10 }}
                onChange={handleRegisterFormChange}
                type="number"
                name="age"
                placeholder="age"
                value={contentRegisterForm.age}
              />
            </Flex>
            <Flex align="center">
              <span style={{ width: '15%' }}>Ocupation:</span>

              <Select
                style={{ width: 200, marginLeft: -15 }}
                // defaultValue={chatEdit.category}
                showSearch
                placeholder="Select an ocupation"
                optionFilterProp="children"
                onChange={handleChangeOcupation}
                // onSearch={onSearch}
                filterOption={filterOption}
                options={occupationOptions}
              />
            </Flex>
            <Flex align="center">
              <span style={{ width: '15%' }}>Country:</span>

              <Select
                style={{ width: 200, marginLeft: -15 }}
                // defaultValue={chatEdit.category}
                showSearch
                placeholder="Select your country"
                optionFilterProp="children"
                onChange={handleChangeCountry}
                // onSearch={onSearch}
                filterOption={filterOption}
                options={countryOptions}
              />
            </Flex>
            <Flex align="start">
              <p style={{ width: '15%' }}>About you:</p>

              <TextArea
                // value={userReview.message}
                style={{ height: 100 }}
                onChange={(e) =>
                  setContentRegisterForm({ ...contentRegisterForm, description: e.target.value })
                }
                placeholder="Write your review ..."
              />
            </Flex>
          </Flex>

          <button type="submit">Register</button>
        </form>
      </Modal>
    </Flex>
  )
}

export default Login
