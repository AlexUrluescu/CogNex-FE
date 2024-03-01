import React, { useReducer, useState } from 'react'
import Chat from '../components/Chat'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { RootState } from '@/state/store'
import { useDispatch } from 'react-redux'
import { getAllUsers, getCurrentUser } from '@/state/appData/selectors'

import { Button } from 'antd'

const ChatPage = () => {
  const currentUser = useSelector(getCurrentUser)
  const allUsers = useSelector(getAllUsers)
  const [pdfUrl, setPdfUrl] = useState<any>(null)
  const router = useRouter()
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {}

  const url = process.env.NEXT_PUBLIC_ROUTE

  const handleSend = async (event: any) => {
    event.preventDefault()

    try {
      const res = await fetch(`${url}/test2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: 'hei' }),
      })

      const data = await res.json()

      // console.log("data", data);
    } catch (error) {
      console.log(error)
    }
  }

  const handleClick = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/pdfs/ro_test.pdf')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      setPdfUrl(url)
    } catch (error) {
      console.error('Error fetching PDF:', error)
    }
  }

  if (currentUser === undefined) {
    return
  }

  return (
    <div>
      <div>
        <h1>CogNex</h1>
        <span>
          WELCOME {currentUser.firstName} {currentUser.lastName}
        </span>
        <span>Files</span>
        {/* {currentUser.files.length > 0 ? (
          <div>
            {currentUser.files.map((fileName: any) => (
              <span key={fileName}>{fileName}</span>
            ))}
          </div>
        ) : (
          "no files uploaded"
        )} */}
        <Button onClick={() => console.log('is working')}>Click me</Button>
        {pdfUrl ? (
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
            View PDF
          </a>
        ) : null}

        <button onClick={handleClick}>test</button>
        <input type="text" onChange={handleChange}></input>
        <button onClick={handleSend}>send</button>
      </div>
      <button onClick={() => router.push('/login')}>Login</button>
      <Chat />
    </div>
  )
}

export default ChatPage
