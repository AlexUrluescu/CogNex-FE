import { RobotOutlined, WarningOutlined } from '@ant-design/icons'
import { Button, Flex, Input } from 'antd'
import React, { useState } from 'react'

interface IMessage {
  entity: 'user' | 'bot'
  message: string
}

interface IChatDisplay {
  chatColor: string
  hasRights?: boolean | undefined
}

export const ChatDisplay: React.FC<IChatDisplay> = ({ chatColor, hasRights }) => {
  const [messages, setMessages] = useState<IMessage[]>([{ entity: 'bot', message: 'Hello there' }])
  return (
    <Flex gap={5} vertical style={{ height: '100vh' }}>
      <Flex
        style={{ height: '65vh', padding: 20, borderRadius: 8, border: '1px solid gray' }}
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
            <Flex
              style={{
                padding: 10,
                borderRadius: '50%',
                backgroundColor: chatColor,
              }}
            >
              <RobotOutlined style={{ color: 'white' }} />
            </Flex>

            <span>{message.message}</span>
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
          disabled={hasRights === false ? true : false}
          placeholder="Type"
          style={{ width: '90%' }}
        />
        <Button disabled={hasRights === false ? true : false} style={{ width: '10%' }}>
          Send
        </Button>
      </Flex>
    </Flex>
  )
}
