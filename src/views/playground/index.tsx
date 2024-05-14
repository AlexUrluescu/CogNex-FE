import { PlaygroundChats } from '@/components/playground/playgroundChats'
import { PlaygroundTeleports } from '@/components/playground/playgroundTeleports'
import { Flex, Tabs, TabsProps } from 'antd'
import React from 'react'

export const PlaygroundView = () => {
  const onChange = (key: string) => {
    // console.log(key)
  }
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Chats',
      children: <PlaygroundChats />,
    },
    {
      key: '2',
      label: 'Teleports',
      children: <PlaygroundTeleports />,
    },
  ]
  return (
    <Flex style={{}}>
      <Tabs
        size="large"
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
        style={{ width: '100%' }}
      />
    </Flex>
  )
}
