import { IChat } from '@/domain/chat'
import { IUser } from '@/domain/user'
import { ChatRepository } from '@/repositories/chat'
// import { RegisterRepository } from '@/repositories/register'
// import { UserLogin } from '@/types'

class ChatFlow {
  chatRepository = new ChatRepository()
  async createNewChat(chat: IChat) {
    const newChat = await this.chatRepository.createChat(chat)
  }
}

const chatFlow = new ChatFlow()

export { chatFlow as ChatFlow }
