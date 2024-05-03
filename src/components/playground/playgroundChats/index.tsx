import { IChat } from '@/domain/chat'
import { UserFlow } from '@/flows/users'
import { getAllChats, getCurrentUser } from '@/state/appData/selectors'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Flex, Tag } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'

export const PlaygroundChats = () => {
  const currentUser = useSelector(getCurrentUser)
  const chats = useSelector(getAllChats)
  const router = useRouter()
  const [chatSelected, setChatSelected] = useState<IChat>()

  console.log('chats', chats)

  const subscribedChats = chats.filter((chat) => chat.users.includes(currentUser._id))

  console.log('subscribedChats', subscribedChats)

  return (
    <Flex vertical gap={50}>
      <Flex gap={20}>
        {subscribedChats.map((chat) => (
          <Flex
            key={chat._id}
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
              border: chatSelected?._id === chat._id ? '1px solid #1677ff' : '1px solid #F1F0F0',
            }}
          >
            <Flex gap={10} style={{ paddingBottom: 10 }}>
              <div
                style={{ width: 20, height: 20, borderRadius: '50%', backgroundColor: chat.color }}
              ></div>
              <h4 style={{ height: '20%', fontWeight: 400 }}>{chat.name}</h4>
            </Flex>
            <Flex justify="center">
              <Tag color="purple">{chat.category}</Tag>
            </Flex>

            <Flex gap={10} justify="center" align="center" style={{ width: '100%', marginTop: 30 }}>
              <Button onClick={() => router.push(`/public-chats/${chat._id}`)} type="primary">
                View
              </Button>
              <Button onClick={() => setChatSelected(chat)} type="primary">
                Details
              </Button>
            </Flex>
          </Flex>
        ))}
      </Flex>
      <Flex vertical gap={20}>
        {chatSelected !== undefined ? (
          <Flex
            style={{ border: '1px solid #F1F0F0', borderRadius: 8, padding: 20 }}
            vertical
            gap={20}
          >
            <Flex gap={15} style={{ borderBottom: '1px solid #F1F0F0', paddingBottom: 10 }}>
              {' '}
              <InfoCircleOutlined style={{ fontSize: 25 }} />
              <span style={{ fontSize: 20 }}>Info</span>
            </Flex>
            <Flex gap={10} align="center">
              <span className="title">Name: </span>
              <span>{chatSelected.name}</span>
            </Flex>

            <Flex gap={10} align="center">
              <span className="title">Category: </span>
              <span>{chatSelected.category}</span>
            </Flex>

            <Flex gap={10} align="center">
              <span className="title">Vizibilty: </span>
              <span>
                {chatSelected.vizibility.charAt(0).toUpperCase() + chatSelected.vizibility.slice(1)}
              </span>
            </Flex>

            <Flex gap={10} align="center">
              <span className="title">Owner: </span>
              <span>
                <Link href={`/my-account/${UserFlow.userList[chatSelected.creator]._id}`}>
                  {UserFlow.userList[chatSelected.creator].name}
                </Link>
              </span>
            </Flex>

            <Flex gap={10} align="center">
              <span className="title">Created: </span>
              <span>{chatSelected.dateCreated}</span>
            </Flex>

            <Flex gap={10}>
              <span className="title">Description: </span>
              <span>{chatSelected.description}</span>
            </Flex>
          </Flex>
        ) : null}
      </Flex>
    </Flex>
  )
}
