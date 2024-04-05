import KnowledgeCard from '@/components/KnowledgeCard'
import { getCurrentUser } from '@/state/appData/selectors'
import { Flex } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'

export const MyKnowledgeView = () => {
  const currentUser = useSelector(getCurrentUser)

  if (currentUser === undefined) {
    return
  }

  return (
    <Flex vertical gap={50}>
      <Flex>My Knowledge</Flex>
      <Flex>
        {currentUser.files?.map((file, index) => (
          <KnowledgeCard key={index} title={file} />
        ))}
      </Flex>
    </Flex>
  )
}
