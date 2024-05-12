import { ChatFlow } from '@/flows/chat'
import { RobotOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Flex, Input, Spin } from 'antd'
import React, { ReactNode, useEffect, useState } from 'react'
import Image from 'next/image'
import { getCurrentUser } from '@/state/appData/selectors'
import { useSelector } from 'react-redux'

interface IMessage {
  entity: 'user' | 'bot'
  message: string | ReactNode
}

interface IMessageUser {
  entity: 'user' | 'bot'
  message: string
}

interface IChatDisplay {
  chatColor: string
  chatId: string
  hasRights?: boolean | undefined
}

export const ChatDisplay: React.FC<IChatDisplay> = ({ chatColor, chatId, hasRights }) => {
  const [messages, setMessages] = useState<IMessage[]>([{ entity: 'bot', message: 'Hello there' }])
  const [userMessage, setUserMessage] = useState<IMessageUser>({ entity: 'user', message: '' })
  const [botMessage, setBotMessage] = useState<IMessage>({ entity: 'bot', message: '' })
  const currentUser = useSelector(getCurrentUser)
  const [inputQuestion, setInputQuestion] = useState<string>('')

  const messaje: IMessage[] = [{ entity: 'bot', message: 'Hello there' }]

  useEffect(() => {
    messaje.push({ entity: 'bot', message: 'Hello there' })
    setMessages([{ entity: 'bot', message: 'Hello there' }])
    setUserMessage({ entity: 'user', message: '' })
  }, [chatId])
  const handleInputChange = (e: any) => {
    const { value } = e.target

    const userMessage: IMessageUser = {
      entity: 'user',
      message: value,
    }

    console.log('userMessage', userMessage)

    setUserMessage(userMessage)
  }

  const handleSend = async () => {
    setMessages([...messages, userMessage])
    setUserMessage({ entity: 'user', message: '' })

    const array = [...messages, userMessage]
    let newArray = [...array]

    newArray.push({ entity: 'bot', message: <Spin /> })
    setMessages(newArray)

    const chatResponse = await ChatFlow.getInfoFromChromaDb(userMessage.message, chatId)
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
                  backgroundColor: chatColor,
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
        {hasRights === false ? (
          <Flex gap={10}>
            <WarningOutlined style={{ color: 'red' }} />
            <span style={{ color: 'red' }}>To use the Chat, you have to subscribe !</span>
          </Flex>
        ) : null}
      </Flex>
      <Flex gap={10}>
        <Input
          onChange={handleInputChange}
          disabled={hasRights === false ? true : false}
          placeholder="Type"
          style={{ width: '90%' }}
          value={userMessage.message}
        />
        <Button
          onClick={handleSend}
          type="primary"
          // disabled={true}
          disabled={hasRights === false ? true : false}
          style={{ width: '10%' }}
        >
          Send
        </Button>
      </Flex>
    </Flex>
  )
}
