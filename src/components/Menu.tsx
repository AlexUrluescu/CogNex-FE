import ChatPage from '@/components/ChatPage'
import { getChatsAsCreator, getCurrentUser } from '@/state/appData/selectors'
import { Flex, Menu } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { AppstoreOutlined, RobotOutlined, GlobalOutlined, LockOutlined } from '@ant-design/icons'
import type { MenuProps, MenuTheme } from 'antd'
import { useRouter } from 'next/router'

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

export const CustomMenu = ({ currentUserId }: any) => {
  const [current, setCurrent] = useState('1')

  const router = useRouter()

  const myChatsAsCreator = useSelector(getChatsAsCreator(currentUserId))

  console.log('myChatsAsCreator', myChatsAsCreator)

  const myPrivateChats = myChatsAsCreator.filter((chat) => chat.vizibility === 'private')
  const myPublicChats = myChatsAsCreator.filter((chat) => chat.vizibility === 'public')

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
    setCurrent(e.key)
  }

  const items: MenuItem[] = [
    getItem(<span onClick={() => router.push('/')}>Main Chat</span>, 'sub1', <RobotOutlined />),

    getItem(
      'Public Chats',
      'sub4',
      <GlobalOutlined />,
      myPublicChats.map((chat) =>
        getItem(
          <Flex align="center" gap={10}>
            {/* <span style={{ backgroundColor: 'red', width: 10, height: 10 }}></span> */}
            <div
              style={{
                backgroundColor: chat.color,
                width: '15px',
                height: '15px',
                borderRadius: '50%',
              }}
            >
              {' '}
            </div>
            {chat.name}
          </Flex>,
          chat._id
        )
      )
    ),

    getItem(
      'Private Chats',
      'sub2',
      <LockOutlined />,
      myPrivateChats.map((chat) =>
        getItem(
          <Flex align="center" gap={10}>
            {/* <span style={{ backgroundColor: 'red', width: 10, height: 10 }}></span> */}
            <div
              style={{
                backgroundColor: chat.color,
                width: '15px',
                height: '15px',
                borderRadius: '50%',
              }}
            >
              {' '}
            </div>
            <span onClick={() => router.push(`/private-chats/${chat._id}`)}>{chat.name}</span>
          </Flex>,
          chat._id
        )
      )
    ),
    getItem(
      <span onClick={() => router.push('/my-knowledge')}>My Knowledge</span>,
      'my-knowledge',
      <AppstoreOutlined />
    ),
  ]
  return (
    <Menu
      onClick={onClick}
      style={{ width: '100%', height: '100vh', backgroundColor: '#ECF8F8', overflowY: 'scroll' }}
      defaultOpenKeys={['sub1']}
      selectedKeys={[current]}
      mode="inline"
      items={items}
    />
  )
}
