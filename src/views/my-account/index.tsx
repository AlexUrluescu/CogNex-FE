import { CustomChat } from '@/components/CustomChat'
import { IUser2 } from '@/domain/user'
import { getChatsAsCreator } from '@/state/appData/selectors'
import { UserOutlined } from '@ant-design/icons'
import { Card, Flex } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'

interface IMyAccountView {
  user: IUser2
}

export const MyAccountView: React.FC<IMyAccountView> = ({ user }) => {
  const chats = useSelector(getChatsAsCreator(user._id))

  return (
    <Flex vertical gap={30}>
      <Flex align="center">
        <Flex style={{ width: 60, height: 60 }}>
          <UserOutlined style={{ fontSize: 30 }} />
        </Flex>
        <h2>
          {user.firstName} {user.lastName}
        </h2>
      </Flex>
      <Flex>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aut et sit harum officiis
        provident quo doloremque modi repellat ad suscipit ullam, illum perferendis. Cum quaerat
        cumque vel repellat delectus sequi.
      </Flex>

      <Card title={<h2>Public Chats</h2>}>
        <Flex gap={20}>
          {chats.length !== 0 ? (
            chats.map((chat) => <CustomChat key={chat._id} chat={chat} />)
          ) : (
            <span>no chats available</span>
          )}
        </Flex>
      </Card>
    </Flex>
  )
}
