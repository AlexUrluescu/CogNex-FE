import { IUser, User } from '@/domain/user'
import { RegisterFlow } from '@/flows/register'
import { setCurrentUser } from '@/state/appData/appDataSlice'
import { store } from '@/state/store'
import { Button, Input, Modal } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { auth, provider } from '@/googleSignIn'
import { signInWithPopup } from 'firebase/auth'

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
}

const initialContentRegisterForm = {
  name: '',
  email: '',
  age: '',
  photo: '',
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

  const handleRegisterFormSubmit = async (e: any) => {
    e.preventDefault()

    const newUser = await RegisterFlow.registerNewUser(contentRegisterForm)

    if (newUser !== undefined) {
      localStorage.setItem('user', newUser.user)
      const user = new User({ ...newUser.user })
      store.dispatch(setCurrentUser(user.toJSON()))
      router.push('/')
      setContentRegisterForm(initialContentRegisterForm)
    }
  }

  if (user === undefined) {
    return
  }

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        {/* <input value={user.email} name="email" onChange={handleInputsChange} placeholder="email" /> */}
        <input
          value={inputs.password}
          name="password"
          onChange={handleInputsChange}
          placeholder="password"
          type="password"
        />
        <button type="submit">Login</button>
        <button onClick={() => router.push('/register')}>Register</button>
      </form>
      <Button onClick={handleGoogle}>Google</Button>

      <Modal title="Personal details" open={showRegisterModal}>
        <form onSubmit={handleRegisterFormSubmit}>
          <Input
            onChange={handleRegisterFormChange}
            name="name"
            placeholder="name"
            value={user.name}
            disabled={true}
          />
          <Input
            onChange={handleRegisterFormChange}
            name="email"
            placeholder="email"
            value={user.email}
            disabled={true}
          />
          {/* <Input
            onChange={handleRegisterFormChange}
            name="email"
            placeholder="email"
            value={user.email}
            disabled={true}
          /> */}
          <Input
            onChange={handleRegisterFormChange}
            type="number"
            name="age"
            placeholder="age"
            value={contentRegisterForm.age}
          />

          <button type="submit">Register</button>
        </form>
      </Modal>
    </div>
  )
}

export default Login
