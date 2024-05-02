import KnowledgeCard from '@/components/KnowledgeCard'
import { CollapsibleSection } from '@/components/collapsibleSection'
import { getChatsAsCreator, getCurrentUser } from '@/state/appData/selectors'
import { Button, Card, Flex } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import type { SelectProps } from 'antd'

const options: SelectProps['options'] = []

export const MyKnowledgeView = () => {
  const currentUser = useSelector(getCurrentUser)
  const myChats = useSelector(getChatsAsCreator(currentUser._id))

  const categories = myChats.map((chat: any) => chat.category)

  const uniqueArray: string[] = []

  categories.forEach((item: any) => {
    if (!uniqueArray.includes(item)) {
      uniqueArray.push(item)
    }
  })

  const handleViewDocument = async (file: any) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/pdfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: file.name, userId: currentUser._id }),
      })

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      window.open(url, '_blank')

      // setPdfUrl(url)
    } catch (error) {
      return error
    }
  }

  return (
    <Flex vertical gap={50}>
      <Flex>My Knowledge</Flex>
      <Flex vertical>
        {uniqueArray.map((category, index) => (
          <CollapsibleSection key={index} title={category}>
            <Flex gap={15}>
              {myChats
                .filter((chat) => chat.category === category)
                .map((chat) =>
                  chat.files.map((file) => (
                    <Card key={index} style={{ maxWidth: 250, minWidth: 200 }}>
                      <Flex vertical align="center" gap={20}>
                        <h4>{file.name}</h4>
                        <Flex gap={10}>
                          <Button type="primary" onClick={() => handleViewDocument(file)}>
                            View
                          </Button>
                        </Flex>
                      </Flex>
                    </Card>
                  ))
                )}
            </Flex>
          </CollapsibleSection>
        ))}
      </Flex>
      {/* <Flex>
        {currentUser.files?.map((file, index) => (
          <KnowledgeCard key={index} title={file} userId={currentUser._id} />
        ))}
      </Flex> */}
    </Flex>
  )
}
