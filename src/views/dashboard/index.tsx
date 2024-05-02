import { CustomChat } from '@/components/CustomChat'
import { getChatsAsCreator, getCurrentUser } from '@/state/appData/selectors'
import { Button, Card, Flex } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'

export const DashboardView = () => {
  const currentUser = useSelector(getCurrentUser)
  const myChatsAsCreator = useSelector(getChatsAsCreator(currentUser._id))
  const myPrivateChats = myChatsAsCreator.filter((chat) => chat.vizibility === 'private')
  const myPublicChats = myChatsAsCreator.filter((chat) => chat.vizibility === 'public')

  return (
    <Flex vertical gap={50}>
      <h1 style={{ fontWeight: 400 }}>Dashboard</h1>
      <Flex vertical gap={50}>
        <Card title={<h2 style={{ fontWeight: 400 }}>Public Chats</h2>}>
          <Flex gap={30}>
            {myPublicChats.length > 0 ? (
              myPublicChats.map((chat) => <CustomChat key={chat._id} chat={chat} />)
            ) : (
              <span>No public chats created</span>
            )}
          </Flex>
        </Card>
        <Card title={<h2 style={{ fontWeight: 400 }}>Private Chats</h2>}>
          <Flex gap={30}>
            {myPrivateChats.length > 0 ? (
              myPrivateChats.map((chat) => <CustomChat key={chat._id} chat={chat} />)
            ) : (
              <span>No private chats created</span>
            )}
          </Flex>
        </Card>
        {/* <Card title={<h2>My knowledge</h2>}>
          <Flex>
            {currentUser.files?.map((file, index) => (
              <Flex key={index}>
                <span>{file}</span>
              </Flex>
            ))}
          </Flex>
        </Card> */}
      </Flex>
    </Flex>
  )
}
