import { CustomChat } from '@/components/CustomChat'
import { getChatsAsCreator, getCurrentUser } from '@/state/appData/selectors'
import { Button, Card, Flex } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'

export const DashboardView = () => {
  const currentUser = useSelector(getCurrentUser)
  const myChatsAsCreator = useSelector(getChatsAsCreator(currentUser._id))

  console.log('chats', myChatsAsCreator)
  console.log('currentuser', currentUser._id)

  const myPrivateChats = myChatsAsCreator.filter((chat) => chat.vizibility === 'private')
  const myPublicChats = myChatsAsCreator.filter((chat) => chat.vizibility === 'public')

  const router = useRouter()

  return (
    <Flex vertical gap={50}>
      <h1>Dashboard</h1>
      <Flex vertical gap={50}>
        <Card title={<h2>My Public Chats</h2>}>
          <Flex gap={30}>
            {myPublicChats.map((chat) => (
              <CustomChat key={chat._id} chat={chat} />
            ))}
          </Flex>
        </Card>
        <Card title={<h2>My Private Chats</h2>}>
          <Flex
            gap={30}
            style={
              {
                // backgroundColor: 'red'
              }
            }
          >
            {myPrivateChats.map((chat) => (
              <CustomChat key={chat._id} chat={chat} />
            ))}
          </Flex>
        </Card>
        <Card title={<h2>My knowledge</h2>}>
          <Flex>
            {currentUser.files?.map((file, index) => (
              <Flex key={index}>
                <span>{file}</span>
              </Flex>
            ))}
          </Flex>
        </Card>
      </Flex>
    </Flex>
  )
}
