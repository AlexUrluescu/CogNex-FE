import Layout from '@/layout'
import { getChatById, getTeleportById } from '@/state/appData/selectors'
import { PrivateChatIdView } from '@/views/private-chats/PrivateChatIdView'
import { TeleportChatIdView } from '@/views/teleport'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

const TeleportChatIdPage = () => {
  const router = useRouter()
  const { teleportId } = router.query

  const teleport = useSelector(getTeleportById(teleportId))

  if (!teleport) {
    return null
  }

  return <TeleportChatIdView teleport={teleport} />
}

export default TeleportChatIdPage
