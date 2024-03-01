import { IUser } from '@/domain/user'
import { RegisterFlow } from '@/flows/register'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

interface IForm {
  email: string
  password: string
}

const initialFormValues = {
  email: '',
  password: '',
}

const Login = () => {
  const [inputs, setInputs] = useState<IForm>(initialFormValues)
  const router = useRouter()

  const handleLogin = async (e: any) => {
    e.preventDefault()
    const loggedUser: IUser = await RegisterFlow.loginUser(inputs)

    if (loggedUser !== undefined) {
      router.push('/')
    }

    const loggedUserSerialized = JSON.stringify(loggedUser)

    localStorage.setItem('user', loggedUserSerialized)
  }

  const handleInputsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setInputs({ ...inputs, [name]: value })
  }

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input
          value={inputs.email}
          name="email"
          onChange={handleInputsChange}
          placeholder="email"
        />
        <input
          value={inputs.password}
          name="password"
          onChange={handleInputsChange}
          placeholder="password"
          type="password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login
