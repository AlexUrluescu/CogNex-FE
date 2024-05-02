import { IChat } from '@/domain/chat'
import { Button, Flex } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'

interface ICustomChat {
  chat: IChat
}

export const CustomChat: React.FC<ICustomChat> = ({ chat }) => {
  const router = useRouter()
  return (
    <Flex
      vertical
      gap={30}
      key={chat._id}
      style={{
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #F1F0F0',
        maxWidth: 250,
        minWidth: 200,
      }}
      align="center"
    >
      <Flex gap={10}>
        <span
          style={{
            width: 20,
            height: 20,
            backgroundColor: chat.color,
            borderRadius: '50%',
          }}
        ></span>
        <span>{chat.name}</span>
      </Flex>

      <Flex>
        <Button type="primary" onClick={() => router.push(`/public-chats/${chat._id}`)}>
          View
        </Button>
      </Flex>
    </Flex>
  )
}
