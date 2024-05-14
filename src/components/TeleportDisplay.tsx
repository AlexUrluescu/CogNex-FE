import { Chat, IChat } from '@/domain/chat'
import { ChatFlow } from '@/flows/chat'
import { setAllChats } from '@/state/appData/appDataSlice'
import { getAllChats, getChatById, getChatsById, getCurrentUser } from '@/state/appData/selectors'
import { store } from '@/state/store'
import { RobotOutlined, UserOutlined, WarningFilled, WarningOutlined } from '@ant-design/icons'
import { Button, Flex, Input, Spin } from 'antd'
import { getAll } from 'firebase/remote-config'
import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'

interface ITeleportDisplay {
  color: string
  id: string
  chats: string[]
}

interface IMessage {
  entity: 'user' | 'bot'
  message: string | ReactNode
}

interface IMessageUser {
  entity: 'user' | 'bot'
  message: string
}

export const TeleportDisplay: React.FC<ITeleportDisplay> = ({ color, id, chats }) => {
  const [messages, setMessages] = useState<IMessage[]>([{ entity: 'bot', message: 'Hello there' }])
  const [userMessage, setUserMessage] = useState<IMessageUser>({ entity: 'user', message: '' })
  const [botMessage, setBotMessage] = useState<IMessage>({ entity: 'bot', message: '' })

  const currentUser = useSelector(getCurrentUser)
  const messaje: IMessage[] = [{ entity: 'bot', message: 'Hello there' }]
  const testChats = useSelector(getChatsById(chats))

  if (testChats[0] === undefined) {
    return
  }

  useEffect(() => {
    messaje.push({ entity: 'bot', message: 'Hello there' })
    setMessages([{ entity: 'bot', message: 'Hello there' }])
    setUserMessage({ entity: 'user', message: '' })
  }, [id])

  const disabled = testChats.find((chat) => {
    if (chat === undefined) {
      return
    }
    return chat.vizibility === 'private'
  })

  const handleInputChange = (e: any) => {
    const { value } = e.target

    const userMessage: IMessageUser = {
      entity: 'user',
      message: value,
    }

    setUserMessage(userMessage)
  }

  // const handleSend = async () => {
  //   setMessages([...messages, userMessage])

  //   const chatResponse = await ChatFlow.getInfoFromChromaDbByTeleport(userMessage.message, id)

  //   console.log(chatResponse)

  //   setUserMessage({ entity: 'user', message: '' })
  // }

  const handleSend = async () => {
    setMessages([...messages, userMessage])
    setUserMessage({ entity: 'user', message: '' })

    const array = [...messages, userMessage]
    let newArray = [...array]

    newArray.push({ entity: 'bot', message: <Spin /> })
    setMessages(newArray)

    const chatResponse = await ChatFlow.getInfoFromChromaDbByTeleport(userMessage.message, id)
    // const chatResponse = 'hola'

    const array2 = [...messages, userMessage]
    let newArray2 = [...array2]

    newArray2.push({ entity: 'bot', message: chatResponse })

    setMessages(newArray2)
    setUserMessage({ entity: 'user', message: '' })
  }

  useEffect(() => {
    if (botMessage.message === '') {
      return
    }
    setMessages([...messages, botMessage])
  }, [botMessage])

  return (
    <Flex gap={5} vertical style={{ height: '100vh' }}>
      <Flex gap={5} vertical style={{ height: '100vh' }}>
        <Flex
          style={{
            height: '60vh',
            padding: 20,
            borderRadius: 8,
            border: '1px solid #EDEDED',
            overflowY: 'scroll',
          }}
          vertical
          gap={15}
        >
          {messages.map((message, index) => (
            <Flex
              align="start"
              gap={10}
              key={index}
              justify={message.entity === 'bot' ? 'start' : 'end'}
            >
              {message.entity === 'bot' ? (
                <Flex
                  style={{
                    padding: 10,
                    borderRadius: '50%',
                    backgroundColor: color,
                  }}
                >
                  <RobotOutlined style={{ color: 'white' }} />
                </Flex>
              ) : null}

              <span style={{ marginTop: 5 }}>{message.message}</span>

              {message.entity === 'user' ? (
                <Flex
                  style={{
                    borderRadius: '50%',
                  }}
                >
                  <Image
                    width={35}
                    height={35}
                    src={currentUser.photo}
                    style={{ borderRadius: '50%' }}
                    alt={''}
                  />
                </Flex>
              ) : null}
            </Flex>
          ))}
        </Flex>
        <Flex gap={10}>
          <Input
            onChange={handleInputChange}
            disabled={!!disabled}
            placeholder="Type"
            style={{ width: '90%' }}
            value={userMessage.message}
          />
          <Button
            onClick={handleSend}
            type="primary"
            // disabled={true}
            disabled={!!disabled}
            style={{ width: '10%' }}
          >
            Send
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}
