import { resetCurrentUser } from '@/state/appData/appDataSlice'
import { getAllUsers, getCurrentUser } from '@/state/appData/selectors'
import { store } from '@/state/store'
import { UserOutlined } from '@ant-design/icons'
import { Button, Dropdown, Flex, MenuProps, Select } from 'antd'
import { useRouter } from 'next/router'
import React, { useReducer, useState } from 'react'
import { useSelector } from 'react-redux'

const Header = () => {
  const currentUser = useSelector(getCurrentUser)
  const allUsers2 = useSelector(getAllUsers)

  console.log('allUsers2', allUsers2)

  const router = useRouter()

  const allUsers3 = allUsers2
    .map((user) => {
      const obj = {
        value: user._id,
        label: user.firstName + ' ' + user.lastName,
        id: user._id,
      }

      return obj
    })
    .filter((user) => user.id !== currentUser._id)

  console.log('allUsers3', allUsers3)

  const allUsers = [
    {
      value: 'jack',
      label: 'Jack',
    },
    {
      value: 'lucy',
      label: 'Lucy',
    },
    {
      value: 'tom',
      label: 'Tom',
    },
  ]

  const items: MenuProps['items'] = [
    {
      label: (
        <Flex gap={10}>
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
          <Button
            type="primary"
            onClick={() => {
              store.dispatch(
                resetCurrentUser({
                  _id: '',
                  email: '',
                  files: [],
                  firstName: '',
                  lastName: '',
                  age: '',
                  password: '',
                })
              )

              localStorage.removeItem('user')
              router.push('/register')
            }}
          >
            Log oouut
          </Button>
        ) : (
          'Log in'
        ),
      key: '3',
    },
  ]

  const onChange = (value: string) => {
    console.log(`selected ${value}`)
    router.push(`/my-account/${value}`)
  }

  const onSearch = (value: string) => {
    console.log('search:', value)
    router.push(`/my-account/${value}`)
  }

  // Filter `option.label` match the user type `input`
  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  return (
    <Flex
      align="center"
      style={{ backgroundColor: '#02182B', padding: '20px 30px', color: 'white', width: '100%' }}
    >
      <Flex style={{ width: '18%' }}>
        <h2>Teleport</h2>
      </Flex>
      <Flex align="center" justify="space-between" style={{ width: '82%' }}>
        <Select
          style={{ width: '80%' }}
          showSearch={true}
          placeholder="Select a person"
          optionFilterProp="children"
          onChange={onChange}
          onSearch={onSearch}
          filterOption={filterOption}
          options={allUsers3}
        />
        <span style={{ width: '20%' }}>
          <Dropdown
            menu={{ items }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
            trigger={['click']}
          >
            <Flex justify="end" style={{ cursor: 'pointer' }} onClick={(e) => e.preventDefault()}>
              <Flex gap={10}>
                <UserOutlined />
                {currentUser.firstName} {currentUser.lastName}
              </Flex>
            </Flex>
          </Dropdown>
        </span>
      </Flex>
    </Flex>
  )
}

export default Header
