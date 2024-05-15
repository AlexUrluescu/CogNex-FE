import Layout from '@/layout'
import { getAllUsers, getChatById, getCurrentUser, getUserById } from '@/state/appData/selectors'
import { MyAccountView } from '@/views/my-account'
import { PrivateChatIdView } from '@/views/private-chats/PrivateChatIdView'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

const MyAccountPage = () => {
  const router = useRouter()
  const { userId } = router.query

  const user = useSelector(getUserById(userId))

  if (user === undefined) {
    return null
  }

  return <MyAccountView user={user} />
}

export default MyAccountPage
