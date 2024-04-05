import { getChatsAsCreator, getCurrentUser } from '@/state/appData/selectors'
import { Button, Card, Flex } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'

export const DashboardView = () => {
  const currentUser = useSelector(getCurrentUser)
  const router = useRouter()

  return (
    <Flex vertical gap={50}>
      <h1>Dashboard</h1>
    </Flex>
  )
}
