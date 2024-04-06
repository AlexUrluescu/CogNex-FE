import { IChat } from '@/domain/chat'
import { IUser } from '@/domain/user'
import { ChatRepository } from '@/repositories/chat'
import { addNewChat } from '@/state/appData/appDataSlice'
// import { RegisterRepository } from '@/repositories/register'
// import { UserLogin } from '@/types'
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
