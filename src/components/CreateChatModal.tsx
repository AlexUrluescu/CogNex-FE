import { getCurrentUser } from '@/state/appData/selectors'
import { Flex, Modal, Spin } from 'antd'
import React, { FormEvent, useState } from 'react'
import { useSelector } from 'react-redux'
import type { RadioChangeEvent } from 'antd'
import { CreateChat } from './CreateChat'
import { format } from 'date-fns'
import axios from 'axios'
import { ChatFlow } from '@/flows/chat'

interface ICreateChatModal {
  handleOk: any
  handleCancel: any
  isModalOpen: any
  setIsModalOpen: any
}

interface IChatFormValues {
  name: string
  category: string
  files: any[]
  description: string
}

const initialChatFormValues: IChatFormValues = {
  name: '',
  category: '',
  files: [],
  description: '',
}

export const CreateChatModal: React.FC<ICreateChatModal> = ({
  setIsModalOpen,
  handleCancel,
  isModalOpen,
}) => {
  const currentUser = useSelector(getCurrentUser)
  const [files, setFiles] = useState<any[]>([])
  const [chatColor, setChatColor] = useState<string>('')
  const [chatFormValues, setChatFormValues] = useState<IChatFormValues>(initialChatFormValues)
  const [value, setValue] = useState(1)
  const [loading, setLoading] = useState(false)

  const onChange2 = (e: RadioChangeEvent) => {
    setValue(e.target.value)
  }

  if (currentUser === undefined || currentUser._id === undefined) {
    return
  }

  // const uploadPdf = async () => {
  //   const formData = new FormData()

  //   files.forEach((fil: any) => {
  //     formData.append('pdfs', fil.originFileObj)
  //   })
  //   formData.append('userId', currentUser._id as string)

  //   axios
  //     .post('http://127.0.0.1:5000/extract', formData)
  //     .then((response) => {
  //       console.log('PDF uploaded successfully:', response.data)
  //       if (response.status === 200) {
  //         setFiles([])
  //         return response.data.ok
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error uploading PDF:', error)
  //     })
  // }
  const uploadPdf = async () => {
    try {
      const formData = new FormData()

      // Assuming 'files' is an array of file objects
      files.forEach((fil) => {
        formData.append('pdfs', fil.originFileObj)
      })

      // Assuming 'currentUser._id' contains the user ID
      formData.append('userId', currentUser._id)

      const response = await axios.post('http://127.0.0.1:5000/extract', formData)

      console.log('PDF uploaded successfully:', response.data)

      if (response.status === 200) {
        setFiles([])
        return response.data.ok
      }
    } catch (error) {
      console.error('Error uploading PDF:', error)
    }
  }

  const handleCreateChat = async (e: FormEvent) => {
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
      vizibility: value === 1 ? 'public' : 'private',
      files: [],
      creator: currentUser._id,
      color: chatColor !== '' ? chatColor : '#919191',
      users: [],
      reviews: [],
      dateCreated: dateCreated,
    }

    setLoading(true)

    const ok = await uploadPdf()

    if (ok) {
      const newChat = await ChatFlow.createNewChat(test)

      if (newChat) {
        const success = await ChatFlow.deleteOldPdfs(currentUser._id)
        if (success) {
          setLoading(false)
          setChatFormValues(initialChatFormValues)
          setFiles([])
          setIsModalOpen(false)
        }
      }
    }
  }

  const handleFormCreateChatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target

    setChatFormValues({ ...chatFormValues, [name]: value })
  }

  const createDisabled =
    chatFormValues.category === '' ||
    files.length === 0 ||
    chatFormValues.name === '' ||
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
    <Modal
      style={{ height: 1000 }}
      width={900}
      title="Create Chat"
      open={isModalOpen}
      onOk={handleCreateChat}
      onCancel={() => {
        setChatFormValues(initialChatFormValues)
        setFiles([])
        handleCancel()
      }}
      okText={'Create'}
      cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white', border: 'none' } }}
    >
      <div style={{ minHeight: 550 }}>
        {loading === false ? (
          <CreateChat
            handleCreateChat={handleCreateChat}
            handleFormCreateChatChange={handleFormCreateChatChange}
            chatFormValues={chatFormValues}
            onChange2={onChange2}
            value={value}
            handleColoChange={handleColoChange}
            onChange={onChange}
            createDisabled={createDisabled}
            setFiles={setFiles}
            files={files}
          />
        ) : (
          <Flex justify="center" align="center" style={{ width: '100%', height: 550 }}>
            <Spin size="large" />
          </Flex>
        )}
      </div>
    </Modal>
  )
}
