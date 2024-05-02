import { IChat } from '@/domain/chat'
import { Button, Card, Flex, Input, Popconfirm, PopconfirmProps, Spin, message } from 'antd'
import React, { FormEvent, useState } from 'react'
import KnowledgeCard from './KnowledgeCard'
import { IUser } from '@/domain/user'
import Link from 'next/link'
import { UserFlow } from '@/flows/users'
import { useDispatch } from 'react-redux'
import { updateChatById } from '@/state/appData/appDataSlice'
import DraggerUpload from './DraggerUpload'
import axios from 'axios'
import { ChatFlow } from '@/flows/chat'
import { store } from '@/state/store'

interface IChatSettings {
  chat: IChat
  currentUser: IUser
}

interface IFiles {
  name: string
  documentId: string
}

export const ChatSettings: React.FC<IChatSettings> = ({ chat, currentUser }) => {
  const [editDetails, setEditDetails] = useState<boolean>(false)
  const [editDocuments, setEditDocuments] = useState<boolean>(false)
  const [addDocuments, setAddDocuments] = useState<boolean>(false)
  const [files, setFiles] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const handleGetDocs = () => {
    if (chat._id === undefined) {
      return
    }
  }

  if (currentUser._id === undefined) {
    return
  }

  const uploadPdf = async () => {
    try {
      const formData = new FormData()

      files.forEach((fil) => {
        formData.append('pdfs', fil.originFileObj)
      })

      formData.append('userId', currentUser._id)

      const response = await axios.post('http://127.0.0.1:5000/extract', formData)

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
    setLoading(true)

    const ok = await uploadPdf()

    if (ok) {
      const newChat = await ChatFlow.addPdfs(chat)

      if (newChat) {
        const success = await ChatFlow.deleteOldPdfs(currentUser._id)
        if (success) {
          setLoading(false)

          store.dispatch(updateChatById({ ...newChat.chat }))
          ChatFlow.chatList[newChat._id] = { ...newChat.chat }
        }
      }
    }
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

  const handleEditDetails = () => {
    setEditDetails(true)
  }

  const handleFinishDetails = () => {
    setEditDetails(false)
  }

  const handleEditDocuments = () => {
    setEditDocuments(true)
  }

  const handleFinishDocuments = () => {
    setEditDocuments(false)
  }

  const handleViewDocument = async (file: any) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/pdfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: file.name, userId: currentUser._id }),
      })

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      // setPdfUrl(url)
    } catch (error) {
      return error
    }
  }

  const handleDelete = async (documentId: string, chatId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/delete-docs`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentId: documentId, chatId: chatId }),
      })

      const data = await res.json()
      dispatch(updateChatById(data.chat))
    } catch (error) {
      return error
    }
  }

  const handleAddDocuments = () => {
    setAddDocuments(true)
  }

  if (chat === undefined) {
    return
  }

  const btnUploadDisabled = files.length > 0

  return (
    <Flex vertical gap={25} style={{ padding: ' 0 25px' }}>
      <Flex vertical>
        <Flex
          style={{
            borderBottom: '1px solid #ECEBEB',
            padding: '10px 0px',
          }}
          align="center"
          justify="space-between"
        >
          <span style={{ fontSize: 25, fontWeight: 600 }}>Documents</span>
          {editDocuments ? (
            <Flex>
              <Button type="primary" onClick={handleFinishDocuments}>
                FINISH
              </Button>
            </Flex>
          ) : (
            <Flex gap={10}>
              {addDocuments === false ? (
                <Button type="primary" onClick={handleAddDocuments}>
                  ADD
                </Button>
              ) : null}

              {addDocuments ? (
                <Button type="primary" onClick={() => setAddDocuments(false)}>
                  FINISH
                </Button>
              ) : (
                <Button danger type="primary" onClick={handleEditDocuments}>
                  DELETE
                </Button>
              )}
            </Flex>
          )}
        </Flex>
        <Flex vertical gap={20} style={{ padding: 20 }}>
          <Flex gap={15}>
            {loading === false ? (
              chat.files?.map((file, index) => (
                <Card key={index} style={{ maxWidth: 250, minWidth: 200 }}>
                  <Flex vertical align="center" gap={20}>
                    <h5>{file.name}</h5>
                    <Flex gap={10}>
                      <Button type="primary" onClick={() => handleViewDocument(file)}>
                        View
                      </Button>
                      {editDocuments ? (
                        <Popconfirm
                          title={`Delete the ${file.name}`}
                          description="Are you sure to delete this document?"
                          onConfirm={() => handleDelete(file.documentId, chat._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="primary" danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      ) : null}
                    </Flex>
                  </Flex>
                </Card>
              ))
            ) : (
              <Spin size="large" />
            )}
          </Flex>
          {addDocuments ? (
            <Flex vertical gap={10}>
              <DraggerUpload setFile={setFiles} file={files} onChange={onChange} />
              <Button disabled={!btnUploadDisabled} type="primary" onClick={handleCreateChat}>
                UPLOAD
              </Button>
            </Flex>
          ) : null}
        </Flex>
      </Flex>
      <Flex vertical gap={10}>
        <Flex
          style={{
            borderBottom: '1px solid #ECEBEB',
            padding: '10px 0px',
          }}
          align="center"
          justify="space-between"
        >
          <span style={{ fontSize: 25, fontWeight: 600 }}>Details</span>

          {editDetails ? (
            <Button type="primary" onClick={handleFinishDetails}>
              FINISH
            </Button>
          ) : (
            <Button type="primary" onClick={handleEditDetails}>
              EDIT
            </Button>
          )}
        </Flex>
        <Flex vertical gap={15} style={{ padding: 10 }}>
          <Flex gap={10} align="start">
            <span className="title">Name: </span>
            {editDetails === true ? (
              <Input style={{ width: '85%' }} defaultValue={chat.name}></Input>
            ) : (
              <span>{chat.name}</span>
            )}
          </Flex>

          <Flex gap={10} align="start">
            <span className="title">Category: </span>
            {editDetails === true ? (
              <Input style={{ width: '85%' }} defaultValue={chat.category}></Input>
            ) : (
              <span>{chat.category}</span>
            )}
          </Flex>

          <Flex gap={10} align="center">
            <span className="title">Vizibilty: </span>
            <span>{chat.vizibility.charAt(0).toUpperCase() + chat.vizibility.slice(1)}</span>
          </Flex>

          <Flex gap={10} align="center">
            <span className="title">Owner: </span>
            <span>
              <Link href={`/my-account/${UserFlow.userList[chat.creator]._id}`}>
                {UserFlow.userList[chat.creator].name}
              </Link>
            </span>
          </Flex>

          <Flex gap={10} align="center">
            <span className="title">Created: </span>
            <span>{chat.dateCreated}</span>
          </Flex>

          <Flex gap={10}>
            <span className="title">Description: </span>
            {editDetails === true ? (
              <Input style={{ width: '85%' }} defaultValue={chat.description}></Input>
            ) : (
              <span>{chat.description}</span>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
