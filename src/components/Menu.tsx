import { getChatsAsCreator, getTeleportsAsCreator } from '@/state/appData/selectors'
import { Button, ConfigProvider, Flex, Menu } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  AppstoreOutlined,
  RobotOutlined,
  GlobalOutlined,
  LockOutlined,
  CodeSandboxOutlined,
  FolderOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useRouter } from 'next/router'
import { CreateChatModal } from './CreateChatModal'
import { TinyColor } from '@ctrl/tinycolor'

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

  const colors1 = ['#6253E1', '#04BEFE']
  const colors2 = ['#fc6076', '#ff9a44', '#ef9d43', '#e75516']
  const colors3 = ['#40e495', '#30dd8a', '#2bb673']
  const getHoverColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString())
  const getActiveColors = (colors: string[]) =>
    colors.map((color) => new TinyColor(color).darken(5).toString())

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const items: MenuItem[] = [
    // getItem(<span onClick={() => router.push('/')}>Main Chat</span>, 'sub1', <RobotOutlined />),
    getItem(
      <div onClick={() => router.push('/')}>
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
                width: '19px',
                height: '16px',
                borderRadius: '50%',
              }}
            >
              {' '}
            </div>
            <div style={{ width: '100%' }} onClick={() => router.push(`/public-chats/${chat._id}`)}>
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
                width: '19px',
                height: '16px',
                borderRadius: '50%',
              }}
            >
              {' '}
            </div>
            <div
              style={{ width: '100%' }}
              onClick={() => router.push(`/private-chats/${chat._id}`)}
            >
              <span>{chat.name}</span>
            </div>
          </Flex>,
          chat._id
        )
      )
    ),

    // getItem(
    //   'Teleports',
    //   'tele',
    //   <AppstoreOutlined />,
    //   // <span onClick={() => router.push('/teleports')}>Teleports</span>,
    //   teleportsOptions.map((tel) =>
    //     getItem(
    //       <div onClick={() => router.push(tel.route)}>
    //         <span>{tel.name}</span>
    //       </div>
    //     )
    //   )
    // ),
    getItem(
      <div onClick={() => router.push('/teleports')}>Teleports</div>,
      'Teleport',
      <CodeSandboxOutlined />
    ),
    getItem(
      <div onClick={() => router.push('/playground')}>Playground</div>,
      'Playground',
      <AppstoreOutlined />
    ),
    getItem(
      <div onClick={() => router.push('/my-knowledge')}>My Knowledge</div>,
      'my-knowledge',
      <FolderOutlined />
    ),
  ]
  return (
    <ConfigProvider
      theme={{
        components: {
          Menu: {
            itemMarginInline: 0,
            itemBorderRadius: 0,
            itemMarginBlock: 0,
            itemSelectedBg: '#064ADA',
            itemSelectedColor: '#fff',
            subMenuItemBg: 'rgba(6, 74, 218, 0.10)',
          },
        },
      }}
    >
      <div className="menu-container">
        <Menu
          onClick={onClick}
          style={{
            width: '100%',
            height: '100vh',
            overflowY: 'scroll',
            paddingTop: 20,
          }}
          defaultOpenKeys={['sub1']}
          selectedKeys={[current]}
          mode="inline"
          items={items}
        />

        <Flex justify="center" style={{ padding: 20 }}>
          <ConfigProvider
            theme={{
              components: {
                Button: {
                  colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
                  colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(
                    ', '
                  )})`,
                  colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(
                    ', '
                  )})`,
                  lineWidth: 0,
                },
              },
            }}
          >
            <Button style={{ width: 120 }} onClick={showModal} type="primary" size="large">
              New chat
            </Button>
          </ConfigProvider>
        </Flex>

        <CreateChatModal
          handleOk={handleOk}
          handleCancel={handleCancel}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
        <style jsx global>{`
          .menu-container {
            width: 100%;
            max-width: 250px;
            gap: 8px;
            display: flex;
            flex-direction: column;
            position: sticky;
            top: 0;
            height: 100%;
            flex: 1;
            box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
            overflow-y: auto;
          }
          .ant-menu-submenu-open .ant-menu-submenu-title > span,
          .ant-menu-submenu-open .ant-menu-submenu-title > i,
          .ant-menu-submenu-selected .ant-menu-submenu-title > span,
          .ant-menu-submenu-selected .ant-menu-submenu-title > i,
          .ant-menu-submenu-selected .ant-menu-item-icon svg {
            color: #000842;
            fill: #000842;
          }
        `}</style>
      </div>
    </ConfigProvider>
  )
}
