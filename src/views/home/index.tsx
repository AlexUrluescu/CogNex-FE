import ChatPage from '@/components/ChatPage'
import { getCurrentUser } from '@/state/appData/selectors'
import { Button, Dropdown, Flex, Space } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { CustomMenu } from '@/components/Menu'
import { useRouter } from 'next/router'

const HomeView = () => {
  const currentUser = useSelector(getCurrentUser)

  const router = useRouter()

  const items: MenuProps['items'] = [
    {
      label: <Flex gap={10}>My account</Flex>,
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label:
        currentUser !== undefined ? (
          <Button type="primary" onClick={() => router.push('/register')}>
            Log out
          </Button>
        ) : (
          'Log in'
        ),
      key: '3',
    },
  ]

  return (
    <div>
      <Flex
        justify="space-between"
        align="center"
        style={{ backgroundColor: '#02182B', padding: '20px 30px', color: 'white' }}
      >
        <h2>Teleport</h2>
        <span>
          <Dropdown
            menu={{ items }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
            trigger={['click']}
          >
            <Flex style={{ cursor: 'pointer' }} gap={10} onClick={(e) => e.preventDefault()}>
              <UserOutlined />
              {currentUser.firstName} {currentUser.lastName}
            </Flex>
          </Dropdown>
        </span>
      </Flex>
      <Flex style={{ width: '100%' }}>
        <Flex vertical style={{ backgroundColor: 'blue', width: '20%' }}>
          <CustomMenu currentUserId={currentUser._id} />
        </Flex>
        <ChatPage />
      </Flex>
    </div>
  )
}

export default HomeView
