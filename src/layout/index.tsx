import { Flex } from 'antd'
import React, { ReactNode } from 'react'
import Header from './components/header'
import { CustomMenu } from '@/components/Menu'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '@/state/appData/selectors'

const Layout = ({ children }: any) => {
  const currentUser = useSelector(getCurrentUser)
  return (
    <div>
      <Header />
      <Flex style={{ width: '100%' }}>
        <Flex vertical style={{ backgroundColor: 'blue', width: '20%' }}>
          <CustomMenu currentUserId={currentUser._id} />
        </Flex>
        <div style={{ width: '85%', padding: 30 }}>{children}</div>
      </Flex>
    </div>
  )
}

export default Layout
