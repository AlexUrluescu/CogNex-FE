import { ChatFlow } from '@/flows/chat'
import { RobotOutlined, UserOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import React, { useEffect, useState } from 'react'

interface IMessage {
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
  const [userMessage, setUserMessage] = useState<IMessage>({ entity: 'user', message: '' })

  useEffect(() => {
    setMessages([{ entity: 'bot', message: 'Hello there' }])
    setUserMessage({ entity: 'user', message: '' })
  }, [chatId])
  const handleInputChange = (e: any) => {
    const { value } = e.target

    const userMessage: IMessage = {
      entity: 'user',
      message: value,
    }

    setUserMessage(userMessage)
  }

  const handleSend = () => {
    setMessages([...messages, userMessage])

    ChatFlow.getInfoFromChromaDb(userMessage.message, chatId)

    setUserMessage({ entity: 'user', message: '' })
  }
  return (
    <Flex gap={5} vertical style={{ height: '100vh' }}>
      <Flex
        style={{ height: '60vh', padding: 20, borderRadius: 8, border: '1px solid gray' }}
        vertical
        gap={10}
      >
        {messages.map((message, index) => (
          <Flex
            align="center"
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

            <span>{message.message}</span>

            {message.entity === 'user' ? (
              <Flex
                style={{
                  padding: 10,
                  borderRadius: '50%',
                  backgroundColor: chatColor,
                }}
              >
                <UserOutlined style={{ color: 'white' }} />
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
          disabled={true}
          // disabled={hasRights === false ? true : false}
          style={{ width: '10%' }}
        >
          Sendd
        </Button>
      </Flex>
    </Flex>
  )
}
