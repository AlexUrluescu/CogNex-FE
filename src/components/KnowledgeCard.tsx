import { Card } from 'antd'
import React from 'react'

interface IKnowledgeCard {
  title: string
}

const KnowledgeCard: React.FC<IKnowledgeCard> = ({ title }) => {
  return <Card>{title}</Card>
}

export default KnowledgeCard
