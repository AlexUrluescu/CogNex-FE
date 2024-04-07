import { IChat } from '@/domain/chat'
import { IUser } from '@/domain/user'
import { UserLogin } from '@/types'

export class ChatRepository {
  async createChat(chat: IChat) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/create_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat }),
      })

      const data = await res.json()

      //   if (data.user === undefined || data.sucess === false) {
      //     return
      //   }

      return data
    } catch (error) {
      return error
    }
  }
}
