import Layout from '@/layout'
import { getChatById } from '@/state/appData/selectors'
import { PrivateChatIdView } from '@/views/private-chats/PrivateChatIdView'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

const PrivateChatIdPage = () => {
  const router = useRouter()
  const { chatId } = router.query

  const chat = useSelector(getChatById(chatId))

  if (!chat) {
    return null
  }

  return <PrivateChatIdView chat={chat} />
}

export default PrivateChatIdPage
