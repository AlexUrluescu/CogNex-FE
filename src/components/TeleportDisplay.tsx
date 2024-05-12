import { Chat, IChat } from '@/domain/chat'
import { ChatFlow } from '@/flows/chat'
import { setAllChats } from '@/state/appData/appDataSlice'
import { getAllChats, getChatById, getChatsById } from '@/state/appData/selectors'
import { store } from '@/state/store'
import { RobotOutlined, UserOutlined, WarningFilled, WarningOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import { getAll } from 'firebase/remote-config'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

interface ITeleportDisplay {
  color: string
  id: string
  chats: string[]
}

interface IMessage {
  entity: 'user' | 'bot'
  message: string
}

export const TeleportDisplay: React.FC<ITeleportDisplay> = ({ color, id, chats }) => {
  const [messages, setMessages] = useState<IMessage[]>([{ entity: 'bot', message: 'Hello there' }])
  const [userMessage, setUserMessage] = useState<IMessage>({ entity: 'user', message: '' })

  const testChats = useSelector(getChatsById(chats))

  if (testChats[0] === undefined) {
    return
  }

  const disabled = testChats.find((chat) => {
    if (chat === undefined) {
      return
    }
    return chat.vizibility === 'private'
  })

  const handleInputChange = (e: any) => {
    const { value } = e.target

    const userMessage: IMessage = {
      entity: 'user',
      message: value,
    }

    setUserMessage(userMessage)
  }

  const handleSend = async () => {
    setMessages([...messages, userMessage])

    const chatResponse = await ChatFlow.getInfoFromChromaDbByTeleport(userMessage.message, id)

    console.log(chatResponse)

    setUserMessage({ entity: 'user', message: '' })
  }

  return (
    <Flex gap={5} vertical style={{ height: '100vh' }}>
      <Flex
        style={{ height: '60vh', padding: 20, borderRadius: 8, border: '1px solid #EDEDED' }}
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
                  backgroundColor: color,
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
                  backgroundColor: color,
                }}
              >
                <UserOutlined style={{ color: 'white' }} />
              </Flex>
            ) : null}
          </Flex>
        ))}
        <Flex>
          {!!disabled ? (
            <div>
              <WarningFilled style={{ color: 'red' }} />{' '}
              <span style={{ color: 'red' }}>
                This teleport has private chats, please delete them
              </span>
            </div>
          ) : null}
        </Flex>
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
          disabled={!!disabled}
          // disabled={hasRights === false ? true : false}
          style={{ width: '10%' }}
        >
          Sendd
        </Button>
      </Flex>
    </Flex>
  )
}
