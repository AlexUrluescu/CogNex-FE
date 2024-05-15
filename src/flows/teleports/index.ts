import { ITeleport } from '@/domain/teleports'
import { TeleportsRepository } from '@/repositories/teleports'

import {
  addNewChat,
  addNewTeleport,
  deleteTeleport,
  updateChatById,
} from '@/state/appData/appDataSlice'
import { store } from '@/state/store'

class TeleportsFlow {
  teleportsRepository = new TeleportsRepository()
  teleportList: Record<string, ITeleport> = {}

  getTeleportsByCreatorId(id: string) {
    const allChats = Object.values(this.teleportList)

    const chatsFound = allChats.filter((chat) => chat.creator === id)
    return chatsFound
  }

  async createNewTeleport(teleport: ITeleport) {
    const newTeleport = await this.teleportsRepository.createTeleport(teleport)

    store.dispatch(addNewTeleport(newTeleport.teleport))

    this.teleportList[newTeleport._id] = newTeleport

    return newTeleport
  }

  async deleteTeleport(teleportId: string) {
    const teleportDeletedId = await this.teleportsRepository.deleteTeleport(teleportId)

    store.dispatch(deleteTeleport(teleportDeletedId.teleport))

    this.teleportList[teleportDeletedId.teleport] &&
      delete this.teleportList[teleportDeletedId.teleport]

    return teleportDeletedId
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
      this.teleportList[data.chat._id] = { ...data.chat }
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

  storeIntoList(chats: ITeleport[]) {
    chats.forEach((chat) => {
      if (chat._id === undefined) {
        return
      }
      this.teleportList[chat._id] = chat
    })
  }
}

const teleportsFlow = new TeleportsFlow()
export { teleportsFlow as TeleportsFlow }
