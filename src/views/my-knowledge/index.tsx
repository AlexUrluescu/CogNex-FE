import KnowledgeCard from '@/components/KnowledgeCard'
import { CollapsibleSection } from '@/components/collapsibleSection'
import { getChatsAsCreator, getCurrentUser } from '@/state/appData/selectors'
import { Button, Card, Flex } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import type { SelectProps } from 'antd'

const options: SelectProps['options'] = []

interface IStatistic {
  name: string
  repeat: number
}

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

  function countOccurrences(arr: string[]) {
    let counts: any = {}
    arr.forEach(function (item: any) {
      counts[item] = (counts[item] || 0) + 1
    })

    let result: any = []
    Object.keys(counts).forEach(function (key) {
      result.push({ name: key, repeat: counts[key] })
    })

    return result
  }

  let statisticChatsCategories = countOccurrences(categories)

  return (
    <Flex vertical gap={40}>
      <Flex>My Knowledge</Flex>
      <Flex gap={25} style={{ padding: 20, overflowX: 'scroll' }}>
        {statisticChatsCategories.map((statistic: IStatistic) => (
          <Flex
            key={statistic.name}
            align="center"
            vertical
            style={{
              padding: 20,
              minWidth: 200,
              maxWidth: 250,
              borderRadius: 8,
              height: 180,
              border: '1px solid #F1F0F0',
            }}
          >
            <h4 style={{ height: '20%', fontWeight: 400 }}>{statistic.name}</h4>
            <Flex justify="center" align="center" style={{ height: '80%', width: '100%' }}>
              <span style={{ fontSize: 45 }}> {statistic.repeat}</span>
            </Flex>
          </Flex>
        ))}
      </Flex>

      <Flex vertical>
        {uniqueArray.map((category, index) => (
          <CollapsibleSection key={index} title={category}>
            <Flex gap={15} style={{ overflowX: 'scroll' }}>
              {myChats
                .filter((chat) => chat.category === category)
                .map((chat) =>
                  chat.files.map((file) => (
                    <Card key={index} style={{ maxWidth: 250, minWidth: 200 }}>
                      <Flex vertical align="center" gap={20}>
                        <span style={{ fontSize: 17, fontWeight: 400 }}>{file.name}</span>
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
