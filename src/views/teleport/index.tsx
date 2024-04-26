import { ChatDetails } from '@/components/ChatDetails'
import { ChatDisplay } from '@/components/ChatDisplay'
import { ITeleport } from '@/domain/teleports'
import { getCurrentUser } from '@/state/appData/selectors'
import { Button, Flex } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import { Tabs } from 'antd'
import type { TabsProps } from 'antd'
import { TeleportDetails } from '@/components/TeleportDetails'
import { TeleportDisplay } from '@/components/TeleportDisplay'

interface ITeleportChatIdView {
  teleport: ITeleport
}

export const TeleportChatIdView: React.FC<ITeleportChatIdView> = ({ teleport }) => {
  const currentUser = useSelector(getCurrentUser)

  const onChange = (key: string) => {
    // console.log(key)
  }

  //   const isChatUser = chat.users.find((userId) => userId === currentUser._id)
  //   const isChatOwner = currentUser._id === chat.creator

  //   const hasRights = !!isChatUser && isChatOwner === false

  const handleGetDocs = () => {
    if (teleport._id === undefined) {
      return
    }
    // ChatFlow.getInfoFromChromaDb(chat.creator, chat._id)
  }

  if (teleport._id === undefined) {
    return
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Teleport',
      children: <TeleportDisplay color={teleport.color} id={teleport._id} />,
    },
    {
      key: '2',
      label: 'Details',
      children: <TeleportDetails teleport={teleport} />,
    },
    {
      key: '3',
      label: 'Settings',
      children: (
        <Button disabled={true} onClick={handleGetDocs}>
          GET DOCUMENTS
        </Button>
      ),
    },
  ]

  return (
    <Flex vertical gap={30}>
      <Flex justify="space-between">
        <Flex gap={10}>
          <div
            style={{ width: 30, height: 30, backgroundColor: teleport.color, borderRadius: '50%' }}
          ></div>
          <h2>{teleport.name}</h2>
        </Flex>
        <Flex align="center" style={{ border: '2px solid black', padding: 10, borderRadius: 12 }}>
          <span className="rainbow-text">TELEPORT</span>
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

      <style jsx>{`
        .rainbow-text {
          background-image: linear-gradient(to left, violet, indigo, blue, green, orange, red);
          -webkit-background-clip: text;
          color: transparent;
          font-weight: bold;
        }
      `}</style>
    </Flex>
  )
}
