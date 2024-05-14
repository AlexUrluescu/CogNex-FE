import { Button, Card, Flex } from 'antd'
import React from 'react'

interface IKnowledgeCard {
  title: string
  userId: string
}

const KnowledgeCard: React.FC<IKnowledgeCard> = ({ title, userId }) => {
  const handleClick2 = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/pdfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: title, userId: userId }),
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
    <Card>
      <Flex vertical align="center" gap={20}>
        <h5>{title}</h5>
        <Button onClick={handleClick2}>View</Button>
      </Flex>
    </Card>
  )
}

export default KnowledgeCard
