import Layout from '@/layout'
import { getChatById, getUserById } from '@/state/appData/selectors'
import { MyAccountView } from '@/views/my-account'
import { PrivateChatIdView } from '@/views/private-chats/PrivateChatIdView'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

const MyAccountPage = () => {
  const router = useRouter()
  const { userId } = router.query

  const user = useSelector(getUserById(userId))

  if (!user) {
    return null
  }

  return (
    <Layout>
      <MyAccountView user={user} />
    </Layout>
  )
}

export default MyAccountPage
