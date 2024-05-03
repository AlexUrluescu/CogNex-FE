import { getCurrentUser, getTeleportsAsCreator } from '@/state/appData/selectors'
import { Button, Flex, Tag } from 'antd'
import router from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'

export const PlaygroundTeleports = () => {
  const currentUser = useSelector(getCurrentUser)
  const myTeleports = useSelector(getTeleportsAsCreator(currentUser._id))

  console.log('myTeleports', myTeleports)

  return (
    <Flex gap={20} wrap="wrap">
      {myTeleports.map((teleport) => (
        <Flex
          key={teleport._id}
          align="center"
          vertical
          gap={10}
          style={{
            // backgroundColor: 'red',
            padding: 20,
            minWidth: 200,
            maxWidth: 250,
            borderRadius: 8,
            height: 180,
            border: '1px solid #F1F0F0',
          }}
        >
          <Flex gap={10} style={{ paddingBottom: 10 }}>
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                backgroundColor: teleport.color,
              }}
            ></div>
            <h4 style={{ height: '20%', fontWeight: 400 }}>{teleport.name}</h4>
          </Flex>
          <Flex justify="center">
            <Tag color="purple">{teleport.category}</Tag>
          </Flex>

          <Flex gap={10} justify="center" align="center" style={{ width: '100%', marginTop: 30 }}>
            <Button onClick={() => router.push(`/public-chats/${teleport._id}`)} type="primary">
              View
            </Button>
            {/* <Button onClick={() => setChatSelected(chat)} type="primary">
          Details
        </Button> */}
          </Flex>
        </Flex>
      ))}
    </Flex>
  )
}
