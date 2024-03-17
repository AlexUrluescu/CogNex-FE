import { getAllChats, getChatsAsCreator, getCurrentUser } from '@/state/appData/selectors'
import { Flex } from 'antd'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { GlobalOutlined, LockOutlined } from '@ant-design/icons'
import { IUser } from '@/domain/user'

interface IMyChatsAsCreator {
  currentUser: string
}

const MyChatsAsCreator: React.FC<IMyChatsAsCreator> = ({ currentUser }) => {
  const myChatsAsCreator = useSelector(getChatsAsCreator(currentUser))

  return (
    <Flex vertical>
      <div>MyChatsAsCreatorr</div>
      <Flex
        justify="space-evenly"
        wrap="wrap"
        gap={40}
        style={{ backgroundColor: 'gray', color: 'white' }}
      >
        {myChatsAsCreator.map((chat) => (
          <Flex vertical key={chat._id}>
            <span>{chat.name}</span>
            <span>{chat.category}</span>
            <span>{chat.vizibility === 'private' ? <LockOutlined /> : <GlobalOutlined />}</span>
            <span style={{ width: 15, height: 15, backgroundColor: chat.color }}></span>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

export default MyChatsAsCreator
