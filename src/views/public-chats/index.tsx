import { IChat } from '@/domain/chat'
import { height } from '@fortawesome/free-solid-svg-icons/fa0'
import { Button, Flex } from 'antd'
import React from 'react'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { getCurrentUser } from '@/state/appData/selectors'
import { useSelector } from 'react-redux'
import { ChatDisplay } from '@/components/ChatDisplay'

interface IPublicChatIdView {
  chat: IChat
}

export const PublicChatIdView: React.FC<IPublicChatIdView> = ({ chat }) => {
  const currentUser = useSelector(getCurrentUser)

  const onChange = (key: string) => {
    console.log(key)
  }

  const isChatUser = chat.users.find((user) => user._id === currentUser._id)
  const isChatOwner = currentUser._id === chat.creator

  const hasRights = !!isChatUser && isChatOwner === false

  const items: TabsProps['items'] = isChatOwner
    ? [
        {
          key: '1',
          label: 'Chat',
          children: <ChatDisplay chatColor={chat.color} />,
        },
        {
          key: '2',
          label: 'Details',
          children: 'Details',
        },
        {
          key: '3',
          label: 'Settings',
          children: 'Settings',
        },
      ]
    : [
        {
          key: '1',
          label: 'Chat',
          children: <ChatDisplay chatColor={chat.color} hasRights={hasRights} />,
        },
        {
          key: '2',
          label: 'Details',
          children: 'Details',
        },
      ]

  return (
    <Flex vertical gap={30}>
      <Flex justify="space-between">
        <Flex gap={10}>
          <div
            style={{ width: 30, height: 30, backgroundColor: chat.color, borderRadius: '50%' }}
          ></div>
          <h2>{chat.name}</h2>
        </Flex>
        <Flex>
          {isChatUser !== null && isChatOwner === false ? (
            <Button type="primary">Subscribe</Button>
          ) : null}
        </Flex>
      </Flex>
      <Flex style={{}}>
        <Tabs
          size="large"
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
          style={{ width: '100%' }}
        />
      </Flex>
    </Flex>
  )
}
