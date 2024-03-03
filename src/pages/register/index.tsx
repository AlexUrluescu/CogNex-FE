import { RegisterFlow } from '@/flows/register'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

type ICcontentRegisterForm = {
  firstName: string
  lastName: string
  email: string
  age: string
  password: string
}

const initialContentRegisterForm = {
  firstName: '',
  lastName: '',
  email: '',
  age: '',
  password: '',
}

const url = process.env.NEXT_PUBLIC_ROUTE

const Register = () => {
  const [contentRegisterForm, setContentRegisterForm] = useState<ICcontentRegisterForm>(
    initialContentRegisterForm
  )

  const router = useRouter()

  const handleRegisterFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setContentRegisterForm({ ...contentRegisterForm, [name]: value })
  }

  const handleRegisterFormSubmit = async (e: any) => {
    e.preventDefault()

    const newUser = await RegisterFlow.registerNewUser(contentRegisterForm)

    if (newUser !== undefined) {
      router.push('/login')
      setContentRegisterForm(initialContentRegisterForm)
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegisterFormSubmit}>
        <input
          onChange={handleRegisterFormChange}
          name="firstName"
          placeholder="firstName"
          value={contentRegisterForm.firstName}
        />
        <input
          onChange={handleRegisterFormChange}
          name="lastName"
          placeholder="lastName"
          value={contentRegisterForm.lastName}
        />
        <input
          onChange={handleRegisterFormChange}
          name="email"
          placeholder="email"
          value={contentRegisterForm.email}
        />
        <input
          onChange={handleRegisterFormChange}
          type="number"
          name="age"
          placeholder="age"
          value={contentRegisterForm.age}
        />

        <input
          onChange={handleRegisterFormChange}
          type="password"
          name="password"
          placeholder="password"
          value={contentRegisterForm.password}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Register
