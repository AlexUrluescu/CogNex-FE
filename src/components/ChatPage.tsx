import React, { FormEvent, useReducer, useState } from 'react'
import Chat from '../components/Chat'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { getAllUsers, getCurrentUser } from '@/state/appData/selectors'

import { Button, Flex } from 'antd'
import DraggerUpload from './DraggerUpload'
import { ChatFlow } from '@/flows/chat'
import MyChatsAsCreator from './MyChatsAsCreator'

interface IChatFormValues {
  name: string
  category: string
  vizibility: string
  files: any[]
}

const initialChatFormValues: IChatFormValues = {
  name: '',
  category: '',
  vizibility: '',
  files: [],
}

const ChatPage = () => {
  const currentUser = useSelector(getCurrentUser)
  const allUsers = useSelector(getAllUsers)
  const [pdfUrl, setPdfUrl] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [chatFormValues, setChatFormValues] = useState<IChatFormValues>(initialChatFormValues)
  const router = useRouter()
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {}

  const url = process.env.NEXT_PUBLIC_ROUTE

  if (currentUser === undefined || currentUser._id === undefined) {
    return
  }

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

  const handleCreateChat = (e: FormEvent) => {
    e.preventDefault()

    console.log('chatFormValues', chatFormValues)

    const files2 = files.map((fil: any) => fil.originFileObj)

    const allFilesToBeUploaded = files2.map((fil: any) => {
      const obj = {
        name: fil.name,
        size: fil.size,
        type: fil.type,
        lastModified: fil.lastModified,
        lastModifiedDate: fil.lastModifiedDate,
      }
      return obj
    })

    if (currentUser._id === undefined) {
      return
    }

    const test = {
      ...chatFormValues,
      files: allFilesToBeUploaded,
      creator: currentUser._id,
      users: [],
      reviews: [],
    }

    ChatFlow.createNewChat(test)
  }

  const handleFormCreateChatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target

    setChatFormValues({ ...chatFormValues, [name]: value })
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
      <Flex vertical>
        <h3>Create chat</h3>
        <form onSubmit={handleCreateChat}>
          <input
            onChange={handleFormCreateChatChange}
            name="name"
            value={chatFormValues.name}
            placeholder="chat name"
          />
          <input
            onChange={handleFormCreateChatChange}
            name="category"
            value={chatFormValues.category}
            placeholder="chat type"
          />
          <input
            onChange={handleFormCreateChatChange}
            name="vizibility"
            placeholder="chat visibility"
            value={chatFormValues.vizibility}
          />
          {/* <input onChange={handleChangeFile} name="file" type="file" accept=".pdf" />
          <UploadFile onChange={handleFormCreateChatChange} name="file" setFile={setFile} /> */}
          <DraggerUpload setFile={setFiles} file={files} />
          <button type="submit">Create</button>
        </form>
        <MyChatsAsCreator />
      </Flex>
    </div>
  )
}

export default ChatPage
