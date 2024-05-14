import { IChat, IChat2 } from '@/domain/chat'
import { IUser } from '@/domain/user'
import { UserLogin } from '@/types'

export class ChatRepository {
  async createChat(chat: IChat2) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/create_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat }),
      })

      const data = await res.json()

      return data
    } catch (error) {
      return error
    }
  }

  async editChat(chat: IChat2) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/edit_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat }),
      })

      const data = await res.json()

      return data
    } catch (error) {
      return error
    }
  }

  async addPdfs(chat: IChat2) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/add-docs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chat }),
      })

      const data = await res.json()

      return data
    } catch (error) {
      return error
    }
  }

  async deleteOldPdfs(currentUserId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/removing_old_pdfs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ creator: currentUserId }),
      })

      const data = await res.json()

      return data
    } catch (error) {
      return error
    }
  }

  async deleteChat(chatId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/delete_chat`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId }),
      })

      const data = await res.json()

      return data
    } catch (error) {
      return error
    }
  }
}
