import { IChat } from '@/domain/chat'
import { ITeleport } from '@/domain/teleports'
import { IUser } from '@/domain/user'
import { UserLogin } from '@/types'

export class TeleportsRepository {
  async createTeleport(teleport: ITeleport) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/create_teleport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teleport }),
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
