import { getAllChats, getChatsAsCreator, getCurrentUser } from '@/state/appData/selectors'
import { Flex } from 'antd'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { GlobalOutlined, LockOutlined } from '@ant-design/icons'

const MyChatsAsCreator = () => {
  const currentUser = useSelector(getCurrentUser)

  if (currentUser._id === undefined) {
    return
  }

  const myChatsAsCreator = useSelector(getChatsAsCreator(currentUser._id))

  return (
    <Flex vertical>
      <div>MyChatsAsCreatorr</div>
      <Flex justify="space-between" wrap="wrap">
        {myChatsAsCreator.map((chat) => (
          <Flex vertical key={chat._id}>
            <span>{chat.name}</span>
            <span>{chat.category}</span>
            <span>{chat.vizibility === 'private' ? <LockOutlined /> : <GlobalOutlined />}</span>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

export default MyChatsAsCreator
