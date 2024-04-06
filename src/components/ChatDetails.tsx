import { IChat } from '@/domain/chat'
import { UserFlow } from '@/flows/users'
import { Button, Card, Flex, Input } from 'antd'
import { SearchProps } from 'antd/es/input/Search'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

interface IChatDetails {
  chat: IChat
}

const { Search } = Input

export const ChatDetails: React.FC<IChatDetails> = ({ chat }) => {
  const router = useRouter()

  const chatUsers = chat.users.map((userId) => {
    const user = UserFlow.userList[userId]

    return user
  })

  const [managedUsers, setManagedtUsers] = useState(chatUsers)

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value)
  const onChange = (e: any) => {
    const { value } = e.target
    const usersFound = chatUsers.filter((user) => user.firstName.includes(value))
    setManagedtUsers(usersFound)
  }

  return (
    <Flex vertical gap={20}>
      <Flex gap={10} align="center">
        <span className="title">Name: </span>
        <span>{chat.name}</span>
      </Flex>

      <Flex gap={10} align="center">
        <span className="title">Category: </span>
        <span>{chat.category}</span>
      </Flex>

      <Flex gap={10} align="center">
        <span className="title">Vizibilty: </span>
        <span>{chat.vizibility}</span>
      </Flex>

      <Flex gap={10} align="center">
        <span className="title">Owner: </span>
        <span>
          <Link href={`/my-account/${UserFlow.userList[chat.creator]._id}`}>
            {UserFlow.userList[chat.creator].firstName} {UserFlow.userList[chat.creator].lastName}
          </Link>
        </span>
      </Flex>

      <Flex gap={10} align="center">
        <span className="title">Created: </span>
        <span>{chat.dateCreated}</span>
      </Flex>

      <Flex gap={10}>
        <span className="title">Description: </span>
        <span>{chat.description}</span>
      </Flex>

      <Flex vertical gap={10} style={{ width: '50%' }}>
        <Flex
          justify="space-between"
          align="center"
          style={{ borderBottom: '1px solid #EFEFEF', padding: '10px 0px' }}
        >
          <span style={{ fontSize: '16px', fontWeight: 600 }}>Users subscribed</span>
          <Search
            onChange={onChange}
            placeholder="Search user"
            onSearch={onSearch}
            style={{ width: '40%' }}
          />
        </Flex>
        <Flex vertical gap={20} style={{ padding: 10, maxHeight: 300, overflowY: 'scroll' }}>
          {managedUsers.length > 0 ? (
            managedUsers.map((user) => (
              <Flex key={user._id} justify="space-between" align="center">
                <Flex gap={10}>
                  <Flex>image</Flex>

                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                </Flex>

                <Button onClick={() => router.push(`/my-account/${user._id}`)} type="primary">
                  View Profile
                </Button>
              </Flex>
            ))
          ) : (
            <p>No users subscribed to this chat</p>
          )}
        </Flex>
      </Flex>
    </Flex>
  )
}
