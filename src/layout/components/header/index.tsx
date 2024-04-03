import { getCurrentUser } from '@/state/appData/selectors'
import { UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, Flex, MenuProps } from 'antd'
import { useRouter } from 'next/router'
import React, { useReducer } from 'react'
import { useSelector } from 'react-redux'

const Header = () => {
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
  )
}

export default Header
