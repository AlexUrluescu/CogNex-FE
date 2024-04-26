import React, { FormEvent, useState } from 'react'
import Chat from '../components/Chat'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { getAllUsers, getCurrentUser } from '@/state/appData/selectors'

import { Button, Flex, ColorPicker, Input } from 'antd'
import DraggerUpload from './DraggerUpload'
import { ChatFlow } from '@/flows/chat'
import MyChatsAsCreator from './MyChatsAsCreator'
import TextArea from 'antd/es/input/TextArea'
import { RobotOutlined, SendOutlined, UserOutlined } from '@ant-design/icons'
import axios from 'axios'

import { format } from 'date-fns'

interface IChatFormValues {
  name: string
  category: string
  vizibility: string
  files: any[]
  description: string
}

const initialChatFormValues: IChatFormValues = {
  name: '',
  category: '',
  vizibility: '',
  files: [],
  description: '',
}

const ChatPage = () => {
  const currentUser = useSelector(getCurrentUser)
  const allUsers = useSelector(getAllUsers)
  const [pdfUrl, setPdfUrl] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [chatColor, setChatColor] = useState<string>('')
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

    const currentDate = new Date()
    const dateCreated = format(currentDate, 'dd-MM-yyyy')

    if (currentUser._id === undefined) {
      return
    }

    const test = {
      ...chatFormValues,
      files: allFilesToBeUploaded,
      creator: currentUser._id,
      color: chatColor,
      users: [],
      reviews: [],
      dateCreated: dateCreated,
    }

    uploadPdf()
    ChatFlow.createNewChat(test)
  }

  const handleFormCreateChatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target

    setChatFormValues({ ...chatFormValues, [name]: value })
  }

  const createDisabled =
    chatFormValues.category === '' ||
    files.length === 0 ||
    chatFormValues.name === '' ||
    chatFormValues.vizibility == '' ||
    chatColor === ''

  const handleColoChange = (hex: string) => {
    setChatColor(hex)
  }

  const messages = [
    {
      type: 'chat',
      message: 'Hello Alex, how can i help you?',
    },
    {
      type: 'user',
      message: 'I want to learn how to make a pizza',
    },
  ]

  const uploadPdf = () => {
    const formData = new FormData()

    files.forEach((fil: any) => {
      formData.append('pdfs', fil.originFileObj)
    })
    formData.append('userId', currentUser._id as string)

    axios
      .post('http://127.0.0.1:5000/extract', formData)
      .then((response) => {
        console.log('PDF uploaded successfully:', response.data)
        if (response.status === 200) {
          setFiles([])
        }
      })
      .catch((error) => {
        console.error('Error uploading PDF:', error)
      })
  }

  const onChange = (info: any) => {
    const { status } = info.file

    if (status === 'uploading') {
      setFiles(info.fileList)
    }

    if (status !== 'uploading') {
      setFiles(info.fileList)
    }
    if (status === 'done') {
      // message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === 'error') {
      // message.error(`${info.file.name} file upload failed.`)
    }
  }

  return (
    <div>
      <Flex vertical gap={15} style={{ height: '100vh', padding: 40 }}>
        <div style={{ height: '85%', width: '100%', borderRadius: 15 }}>
          {messages.map((message, index) => (
            <Flex
              key={index}
              style={{ marginTop: 20 }}
              gap={10}
              align="center"
              justify={message.type === 'user' ? 'start' : 'end'}
            >
              {message.type === 'user' && (
                <span
                  style={{
                    padding: 7,
                    backgroundColor: 'gray',
                    borderRadius: '50%',
                    color: 'white',
                  }}
                >
                  <UserOutlined />
                </span>
              )}
              {message.message}

              {message.type === 'chat' && (
                <span
                  style={{
                    padding: 7,
                    backgroundColor: 'gray',
                    borderRadius: '50%',
                    color: 'white',
                  }}
                >
                  <RobotOutlined />
                </span>
              )}
            </Flex>
          ))}
        </div>
        <Flex gap={10}>
          <TextArea size="large" placeholder="Type your question ..." autoSize />
          <Button size="large" type="primary">
            <SendOutlined />
          </Button>
        </Flex>
      </Flex>
      <div>
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
          <input
            onChange={handleFormCreateChatChange}
            name="description"
            placeholder="description"
            value={chatFormValues.description}
          />
          <ColorPicker
            onChange={(color_, hex) => handleColoChange(hex)}
            defaultValue="#1677ff"
            showText
          />
          {/* <input onChange={handleChangeFile} name="file" type="file" accept=".pdf" />
          <UploadFile onChange={handleFormCreateChatChange} name="file" setFile={setFile} /> */}

          <DraggerUpload setFile={setFiles} file={files} onChange={onChange} />

          <button disabled={createDisabled} style={{ cursor: 'pointer' }} type="submit">
            Create
          </button>
        </form>
        <MyChatsAsCreator currentUser={currentUser._id} />
      </Flex>
    </div>
  )
}

export default ChatPage
