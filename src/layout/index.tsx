import { Button, Flex } from 'antd'
import React, { ReactNode, useState } from 'react'
import Header from './components/header'
import { CustomMenu } from '@/components/Menu'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '@/state/appData/selectors'
import { CreateChatModal } from '@/components/CreateChatModal'

const Layout = ({ children }: any) => {
  const currentUser = useSelector(getCurrentUser)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  return (
    <Flex style={{ height: '100vh' }}>
      <Header />
      <Flex style={{ width: '100%', marginTop: 70 }}>
        <Flex vertical style={{ width: '20%' }}>
          <CustomMenu currentUserId={currentUser._id} />
          {/* <Flex justify="center" style={{ padding: 20 }}>
            <Button style={{ width: 150 }} onClick={showModal}>
              New Chat
            </Button>
          </Flex> */}
        </Flex>
        <div
          style={{
            width: '85%',
            padding: 30,
            marginBottom: 50,

            overflowY: 'scroll',
          }}
        >
          {children}
        </div>
      </Flex>
      <CreateChatModal
        handleOk={handleOk}
        handleCancel={handleCancel}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </Flex>
  )
}

export default Layout
