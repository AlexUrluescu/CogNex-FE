import { IChat } from '@/domain/chat'
import { Button, Card, Flex, Input } from 'antd'
import React, { useState } from 'react'
import KnowledgeCard from './KnowledgeCard'
import { IUser } from '@/domain/user'
import Link from 'next/link'
import { UserFlow } from '@/flows/users'
import { useDispatch } from 'react-redux'
import { updateChatById } from '@/state/appData/appDataSlice'

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
  const dispatch = useDispatch()
  const handleGetDocs = () => {
    if (chat._id === undefined) {
      return
    }
  }

  if (currentUser._id === undefined) {
    return
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

  const handleClick2 = async (file: any) => {
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

  if (chat === undefined) {
    return
  }

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
            <Button type="primary" onClick={handleFinishDocuments}>
              FINISH
            </Button>
          ) : (
            <Button type="primary" onClick={handleEditDocuments}>
              EDIT
            </Button>
          )}
        </Flex>
        <Flex style={{ padding: 20 }}>
          {chat.files?.map((file, index) => (
            <Card key={index}>
              <Flex vertical align="center" gap={20}>
                <h5>{file.name}</h5>
                <Flex gap={10}>
                  <Button onClick={() => handleClick2(file)}>View</Button>
                  {editDocuments ? (
                    <Button
                      type="primary"
                      danger
                      onClick={() => handleDelete(file.documentId, chat._id)}
                    >
                      Delete
                    </Button>
                  ) : null}
                </Flex>
              </Flex>
            </Card>
          ))}
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
