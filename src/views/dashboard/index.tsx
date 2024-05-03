import { CustomChat } from '@/components/CustomChat'
import { IChat } from '@/domain/chat'
import { getChatsAsCreator, getCurrentUser } from '@/state/appData/selectors'
import { Button, Card, Flex, Progress, ProgressProps } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'

export const DashboardView = () => {
  const currentUser = useSelector(getCurrentUser)
  const myChatsAsCreator = useSelector(getChatsAsCreator(currentUser._id))
  const myPrivateChats = myChatsAsCreator.filter((chat) => chat.vizibility === 'private')
  const myPublicChats = myChatsAsCreator.filter((chat) => chat.vizibility === 'public')

  console.log(myPublicChats)
  function calculateTotalUsers(array: IChat[]) {
    let totalUsers = 0
    array.forEach((obj) => {
      totalUsers += obj.users.length
    })
    return totalUsers
  }
  const twoColors: ProgressProps['strokeColor'] = {
    '0%': '#108ee9',
    '100%': '#87d068',
  }

  const totalUsers = calculateTotalUsers(myPublicChats)

  return (
    <Flex vertical gap={35}>
      <Flex gap={20} style={{ padding: 20, width: '100%' }}>
        <Flex
          align="center"
          vertical
          style={{
            padding: 20,
            width: '33%',
            borderRadius: 8,
            height: 180,
            border: '1px solid #F1F0F0',
          }}
        >
          <h4 style={{ height: '20%', fontWeight: 400 }}>Public</h4>
          <Flex justify="center" align="center" style={{ height: '80%', width: '100%' }}>
            <span style={{ fontSize: 45 }}> {myPublicChats.length}</span>
          </Flex>
        </Flex>
        <Flex
          align="center"
          vertical
          style={{
            padding: 20,
            width: '33%',
            borderRadius: 8,
            height: 180,
            border: '1px solid #F1F0F0',
          }}
        >
          <h4 style={{ height: '20%', fontWeight: 400 }}>Private</h4>
          <Flex justify="center" align="center" style={{ height: '80%', width: '100%' }}>
            <span style={{ fontSize: 45 }}> {myPrivateChats.length}</span>
          </Flex>
        </Flex>

        <Flex
          align="center"
          vertical
          style={{
            padding: 20,
            width: '33%',
            borderRadius: 8,
            height: 180,
            border: '1px solid #F1F0F0',
          }}
        >
          <h4 style={{ height: '20%', fontWeight: 400 }}>Users</h4>
          <Flex justify="center" align="center" style={{ height: '80%', width: '100%' }}>
            <span style={{ fontSize: 45 }}> {totalUsers}</span>
          </Flex>
        </Flex>
      </Flex>
      <Flex vertical gap={50}>
        <Flex vertical>
          <Flex style={{ padding: 20 }}>
            <h2 style={{ fontWeight: 400 }}>Public Chats</h2>
          </Flex>
          <Flex style={{ padding: 20 }} gap={30}>
            {myPublicChats.length > 0 ? (
              myPublicChats.map((chat) => <CustomChat key={chat._id} chat={chat} />)
            ) : (
              <span>No public chats created</span>
            )}
          </Flex>
        </Flex>
        <Flex vertical>
          <Flex style={{ padding: 20 }}>
            <h2 style={{ fontWeight: 400 }}>Private Chats</h2>
          </Flex>
          <Flex style={{ padding: 20 }} gap={30}>
            {myPrivateChats.length > 0 ? (
              myPrivateChats.map((chat) => <CustomChat key={chat._id} chat={chat} />)
            ) : (
              <span>No private chats created</span>
            )}
          </Flex>
        </Flex>
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
