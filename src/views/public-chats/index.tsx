import { IChat } from '@/domain/chat'
import { height } from '@fortawesome/free-solid-svg-icons/fa0'
import { Button, Flex, Popconfirm, Tag, message } from 'antd'
import React from 'react'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { getCurrentUser } from '@/state/appData/selectors'
import { useSelector } from 'react-redux'
import { ChatDisplay } from '@/components/ChatDisplay'
import { ChatFlow } from '@/flows/chat'
import { ChatDetails } from '@/components/ChatDetails'
import { ChatSettings } from '@/components/ChatSettings'
import { getRateAverage } from '@/utils'

interface IPublicChatIdView {
  chat: IChat
}

export const PublicChatIdView: React.FC<IPublicChatIdView> = ({ chat }) => {
  const currentUser = useSelector(getCurrentUser)
  const [messageApi, contextHolder] = message.useMessage()

  const success = () => {
    messageApi.open({
      type: 'success',
      content: 'You have subcribed successfully',
    })
  }

  const successUnsubscribed = () => {
    messageApi.open({
      type: 'success',
      content: 'You have unsubcribed successfully',
    })
  }

  const onChange = (key: string) => {
    // console.log(key)
  }

  const isChatUser = chat.users.find((userId) => userId === currentUser._id)
  const isChatOwner = currentUser._id === chat.creator

  const hasRights = !!isChatUser && isChatOwner === false

  const handleGetDocs = () => {
    if (chat._id === undefined) {
      return
    }
    ChatFlow.getInfoFromChromaDb(chat.creator, chat._id)
  }

  if (chat._id === undefined) {
    return
  }

  const items: TabsProps['items'] = isChatOwner
    ? [
        {
          key: '1',
          label: 'Chat',
          children: <ChatDisplay chatColor={chat.color} chatId={chat._id} />,
        },
        {
          key: '2',
          label: 'Details',
          children: <ChatDetails chat={chat} />,
        },
        {
          key: '3',
          label: 'Settings',
          children: <ChatSettings chat={chat} currentUser={currentUser} />,
        },
      ]
    : [
        {
          key: '1',
          label: 'Chat',
          children: <ChatDisplay chatColor={chat.color} chatId={chat._id} hasRights={hasRights} />,
        },
        {
          key: '2',
          label: 'Details',
          children: <ChatDetails chat={chat} />,
        },
      ]

  const handleSubcribe = () => {
    const userId = currentUser._id
    const chatId = chat._id

    if (chatId === undefined) {
      return
    }

    ChatFlow.userSubscribed(userId, chatId)
    success()
  }

  const handleUnsubcribe = async () => {
    console.log('handleUnsubcribe')
    const userId = currentUser._id
    const chatId = chat._id

    if (chatId === undefined) {
      return
    }

    ChatFlow.userUnsubscribed(userId, chatId)
    successUnsubscribed()
  }

  if (chat.reviews === undefined) {
    return
  }

  return (
    <Flex vertical gap={30}>
      {contextHolder}
      <Flex justify="space-between">
        <Flex gap={10}>
          <div
            style={{ width: 30, height: 30, backgroundColor: chat.color, borderRadius: '50%' }}
          ></div>
          <h2>{chat.name}</h2>
          <Flex align="center">
            <Tag color="purple">{chat.category}</Tag>
          </Flex>
        </Flex>
        <Flex>
          {isChatUser === undefined && isChatOwner === false ? (
            <Button type="primary" onClick={handleSubcribe}>
              Subscribe
            </Button>
          ) : currentUser._id !== chat.creator ? (
            <Popconfirm
              title={`Unsubscribed from ${chat.name}`}
              description="Are you sure to unsubscribed this chat?"
              onConfirm={handleUnsubcribe}
              okText="Yes"
              cancelText="No"
            >
              <Button danger type="primary">
                Unsubscribed
              </Button>
            </Popconfirm>
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
