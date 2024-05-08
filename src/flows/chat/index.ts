import { IChat, IChat2 } from '@/domain/chat'
import { ChatRepository } from '@/repositories/chat'
import { addNewChat, deleteChat, updateChatById } from '@/state/appData/appDataSlice'
import { store } from '@/state/store'

class ChatFlow {
  chatRepository = new ChatRepository()
  chatList: Record<string, IChat> = {}

  getChatsByCreatorId(id: string) {
    const allChats = Object.values(this.chatList)

    const chatsFound = allChats.filter((chat) => chat.creator === id)
    return chatsFound
  }

  async createNewChat(chat: IChat2) {
    const newChat = await this.chatRepository.createChat(chat)
    store.dispatch(addNewChat(newChat.chat))

    this.chatList[newChat._id] = newChat

    return newChat
  }

  async addPdfs(chat: IChat2) {
    const newChat = await this.chatRepository.addPdfs(chat)

    return newChat
  }

  async deleteOldPdfs(currentUserId: string) {
    const success = await this.chatRepository.deleteOldPdfs(currentUserId)

    return success
  }

  async deleteChat(chatId: string) {
    const chatDeletedId = await this.chatRepository.deleteChat(chatId)

    store.dispatch(deleteChat(chatDeletedId.chat))

    this.chatList[chatDeletedId.chat] && delete this.chatList[chatDeletedId.chat]

    return chatDeletedId
  }

  async userSubscribed(userId: string, chatId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/subscribed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, chatId }),
      })

      const data = await res.json()

      if (data.chat === null) {
        alert(data.message)
      }

      if (data.chat === undefined || data.ok === false) {
        return
      }

      store.dispatch(updateChatById({ ...data.chat }))
      this.chatList[data.chat._id] = { ...data.chat }
    } catch (error) {
      return error
    }
  }

  async userUnsubscribed(userId: string, chatId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/unsubscribed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, chatId }),
      })

      const data = await res.json()

      if (data.chat === null) {
        alert(data.message)
      }

      if (data.chat === undefined || data.ok === false) {
        return
      }

      store.dispatch(updateChatById({ ...data.chat }))
      this.chatList[data.chat._id] = { ...data.chat }
    } catch (error) {
      return error
    }
  }

  async getInfoFromChromaDb(query: string, chatId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/info-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, chatId }),
      })

      const data = await res.json()

      console.log(data)

      // if (data.documents === null) {
      //   alert(data.message)
      // }

      // if (data.response === undefined || data.ok === false) {
      //   return
      // }
      return
    } catch (error) {
      return error
    }
  }

  getChatsList() {
    return this.chatList
  }

  storeIntoList(chats: IChat[]) {
    chats.forEach((chat) => {
      if (chat._id === undefined) {
        return
      }
      this.chatList[chat._id] = chat
    })
  }
}

const chatFlow = new ChatFlow()

export { chatFlow as ChatFlow }
