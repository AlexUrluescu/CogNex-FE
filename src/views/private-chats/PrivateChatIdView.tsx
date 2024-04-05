import { IChat } from '@/domain/chat'
import React from 'react'

interface IPrivateChatIdView {
  chat: IChat
}

export const PrivateChatIdView: React.FC<IPrivateChatIdView> = ({ chat }) => {
  return (
    <div>
      <span>{chat.name}</span>
    </div>
  )
}
