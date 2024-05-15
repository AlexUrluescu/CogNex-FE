import { IChat } from '@/domain/chat'
import { StarFilled, StarOutlined } from '@ant-design/icons'
import { Button, Flex, Tag } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'

interface ICustomChat {
  chat: IChat
}

export const CustomChat: React.FC<ICustomChat> = ({ chat }) => {
  const router = useRouter()

  if (chat.reviews === undefined) {
    return
  }

  const calculateAverageRate = (reviews: any[]) => {
    const total = reviews.reduce((accumulator, currentValue) => accumulator + currentValue.rate, 0)
    const average = total / reviews.length

    if (average) {
      return average
    } else {
      return 0
    }
  }

  return (
    <Flex
      key={chat._id}
      align="center"
      vertical
      gap={10}
      style={{
        // backgroundColor: 'red',
        padding: 20,
        minWidth: 220,
        // maxWidth: 250,
        borderRadius: 8,
        height: 180,
        border: '1px solid #F1F0F0',
      }}
    >
      <Flex gap={10} style={{ paddingBottom: 10 }}>
        <div
          style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: chat.color }}
        ></div>
        <h4 style={{ height: '20%', fontWeight: 400 }}>{chat.name}</h4>
      </Flex>
      <Flex gap={20}>
        <Tag color="purple">{chat.category}</Tag>
        <span>
          {calculateAverageRate(chat.reviews)} <StarFilled style={{ color: 'gold' }} />
        </span>
      </Flex>

      <Flex gap={10} justify="center" align="center" style={{ width: '100%', marginTop: 30 }}>
        <Button onClick={() => router.push(`/public-chats/${chat._id}`)} type="primary">
          View
        </Button>
      </Flex>
    </Flex>
  )
}
