import Layout from '@/layout'
import { getChatById } from '@/state/appData/selectors'
import { PrivateChatIdView } from '@/views/private-chats/PrivateChatIdView'
import { Button, ConfigProvider, Flex } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const PrivateChatIdPage = () => {
  const router = useRouter()
  const { chatId } = router.query

  const chat = useSelector(getChatById(chatId))

  if (!chat) {
    return null
  }

  return (
    <Layout>
      <PrivateChatIdView chat={chat} />
    </Layout>
  )
}

export default PrivateChatIdPage
