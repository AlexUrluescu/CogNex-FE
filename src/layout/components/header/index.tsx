import { resetCurrentUser } from '@/state/appData/appDataSlice'
import { getAllUsers, getCurrentUser } from '@/state/appData/selectors'
import { store } from '@/state/store'
import { UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, Flex, MenuProps, Select } from 'antd'
import { useRouter } from 'next/router'
import React, { useReducer, useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'

const Header = () => {
  const currentUser = useSelector(getCurrentUser)

  console.log('currentUser', currentUser)

  const allUsers = useSelector(getAllUsers)

  const router = useRouter()

  const allUsersForSearch = allUsers
    .map((user) => {
      const obj = {
        value: user._id,
        label: user.name,
        id: user._id,
      }

      return obj
    })
    .filter((user) => user.id !== currentUser._id)

  const items: MenuProps['items'] = [
    {
      label: (
        <Flex gap={10} justify="center">
          <span onClick={() => router.push(`/my-account/${currentUser._id}`)}>My account</span>
        </Flex>
      ),
      key: '0',
    },
    {
      type: 'divider',
    },
    {
      label:
        currentUser !== undefined ? (
          <Flex justify="center">
            <Button
              type="primary"
              onClick={() => {
                store.dispatch(
                  resetCurrentUser({
                    _id: '',
                    email: '',
                    files: [],
                    name: '',
                    age: '',
                    photo: '',
                    description: '',
                    ocupation: '',
                    country: '',
                  })
                )

                localStorage.removeItem('user')
                router.push('/login')
              }}
            >
              Log out
            </Button>
          </Flex>
        ) : (
          'Log in'
        ),
      key: '3',
    },
  ]

  const onChange = (value: string) => {
    router.push(`/my-account/${value}`)
  }

  const onSearch = (value: string) => {
    router.push(`/my-account/${value}`)
  }

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  return (
    <Flex
      align="center"
      style={{
        backgroundColor: '#064ADA',
        // backgroundColor: '#265ac9',
        padding: '20px 30px',
        color: 'white',
        width: '100%',
        height: '70px',
        position: 'fixed',
        top: 0,
        zIndex: 100,
      }}
    >
      <Flex style={{ width: '20%' }}>
        <h2 style={{ fontSize: 30, marginLeft: 30 }}>Teleport</h2>
      </Flex>
      <Flex justify="end" style={{ width: '80%' }}>
        <span style={{}}>
          <Dropdown
            menu={{ items }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
            trigger={['click']}
          >
            <Flex justify="end" style={{ cursor: 'pointer' }} onClick={(e) => e.preventDefault()}>
              {currentUser.name !== '' ? (
                <Flex gap={10} align="center">
                  <span style={{ fontSize: 17 }}>{currentUser.name}</span>

                  <Image
                    width={35}
                    height={35}
                    src={currentUser.photo}
                    style={{ borderRadius: '50%', border: '1px solid white' }}
                    alt={''}
                  />
                </Flex>
              ) : null}
            </Flex>
          </Dropdown>
        </span>
      </Flex>
    </Flex>
  )
}

export default Header
