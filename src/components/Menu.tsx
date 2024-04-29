import { getChatsAsCreator, getTeleportsAsCreator } from '@/state/appData/selectors'
import { Button, Flex, Menu } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { AppstoreOutlined, RobotOutlined, GlobalOutlined, LockOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useRouter } from 'next/router'
import { CreateChatModal } from './CreateChatModal'

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()
  const myChatsAsCreator = useSelector(getChatsAsCreator(currentUserId))
  const myTeleportAsCreator = useSelector(getTeleportsAsCreator(currentUserId))

  const myPrivateChats = myChatsAsCreator.filter((chat) => chat.vizibility === 'private')
  const myPublicChats = myChatsAsCreator.filter((chat) => chat.vizibility === 'public')

  const teleportsOptions = [
    { name: 'My teleports', route: '/my-teleports' },
    { name: 'Explore', route: '/teleports' },
  ]

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const items: MenuItem[] = [
    getItem(<span onClick={() => router.push('/')}>Main Chat</span>, 'sub1', <RobotOutlined />),
    getItem(
      <span onClick={() => router.push('/dashboard')}>Dashboard</span>,
      'sub5',
      <RobotOutlined />
    ),

    getItem(
      'Public Chats',
      'sub4',
      <GlobalOutlined />,
      myPublicChats.map((chat) =>
        getItem(
          <Flex align="center" gap={10}>
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
            <span onClick={() => router.push(`/public-chats/${chat._id}`)}>{chat.name}</span>
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
    getItem(
      'teleports',
      'sub9',
      <AppstoreOutlined />,
      // <span onClick={() => router.push('/teleports')}>Teleports</span>,
      teleportsOptions.map((tel) =>
        getItem(
          <div onClick={() => router.push(tel.route)}>
            <span>{tel.name}</span>
          </div>
        )
      )
    ),
    getItem(<Button onClick={showModal}>New Chat</Button>),
  ]
  return (
    <>
      <Menu
        onClick={onClick}
        style={{ width: '100%', height: '100vh', backgroundColor: '#ECF8F8', overflowY: 'scroll' }}
        defaultOpenKeys={['sub1']}
        selectedKeys={[current]}
        mode="inline"
        items={items}
      />

      <CreateChatModal
        handleOk={handleOk}
        handleCancel={handleCancel}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  )
}
