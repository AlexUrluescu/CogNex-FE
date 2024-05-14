import { ITeleport } from '@/domain/teleports'

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

      return data
    } catch (error) {
      return error
    }
  }

  async deleteTeleport(teleportId: string) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/delete_teleport`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teleportId }),
      })

      const data = await res.json()

      return data
    } catch (error) {
      return error
    }
  }
}
