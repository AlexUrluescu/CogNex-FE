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
    // getItem(<span onClick={() => router.push('/')}>Main Chat</span>, 'sub1', <RobotOutlined />),
    getItem(
      <div onClick={() => router.push('/dashboard')}>
        <span>Dashboard</span>
      </div>,
      'sub5',
      <RobotOutlined />
    ),

    getItem(
      'Public Chats',
      'sub4',
      <GlobalOutlined />,
      myPublicChats.map((chat) =>
        getItem(
          <Flex key={chat._id} align="center" gap={10}>
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
            <div onClick={() => router.push(`/public-chats/${chat._id}`)}>
              <span>{chat.name}</span>
            </div>
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
            <div onClick={() => router.push(`/private-chats/${chat._id}`)}>
              <span>{chat.name}</span>
            </div>
          </Flex>,
          chat._id
        )
      )
    ),
    getItem(
      <div onClick={() => router.push('/my-knowledge')}>My Knowledge</div>,
      'my-knowledge',
      <AppstoreOutlined />
    ),
    getItem(
      'Teleports',
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
