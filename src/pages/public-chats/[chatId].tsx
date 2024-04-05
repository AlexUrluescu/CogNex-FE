import Layout from '@/layout'
import { getChatById } from '@/state/appData/selectors'
import { PublicChatIdView } from '@/views/public-chats'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

const PublicChatIdPage = () => {
  const router = useRouter()
  const { chatId } = router.query

  const chat = useSelector(getChatById(chatId))

  if (!chat) {
    return null
  }

  return (
    <Layout>
      <PublicChatIdView chat={chat} />
    </Layout>
  )
}

export default PublicChatIdPage
