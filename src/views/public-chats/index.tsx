import { IChat } from '@/domain/chat'
import React from 'react'

interface IPublicChatIdView {
  chat: IChat
}

export const PublicChatIdView: React.FC<IPublicChatIdView> = ({ chat }) => {
  return (
    <div>
      <span>{chat.name}</span>
    </div>
  )
}
