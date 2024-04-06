import { IChat } from '@/domain/chat'
import { ChatRepository } from '@/repositories/chat'
import { addNewChat, updateChatById } from '@/state/appData/appDataSlice'
import { store } from '@/state/store'

class ChatFlow {
  chatRepository = new ChatRepository()
  chatList: Record<string, IChat> = {}
  async createNewChat(chat: IChat) {
    const newChat = await this.chatRepository.createChat(chat)

    console.log('t', newChat)

    store.dispatch(addNewChat(newChat.chat))

    this.chatList[newChat._id] = newChat
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
    } catch (error) {
      return error
    }
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
