import ChatPage from '@/components/ChatPage'
import { getCurrentUser } from '@/state/appData/selectors'
import { Button, Dropdown, Flex, Space } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import { InfoCircleOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { CustomMenu } from '@/components/Menu'
import { useRouter } from 'next/router'
import Header from '@/layout/components/header'
import Layout from '@/layout'

const HomeView = () => {
  const currentUser = useSelector(getCurrentUser)

  return (
    <Layout>
      <ChatPage />
    </Layout>
  )
}

export default HomeView
