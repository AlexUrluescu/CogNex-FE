import { IChat } from '@/domain/chat'
import { ChatFlow } from '@/flows/chat'
import { UserFlow } from '@/flows/users'
import { updateChatById } from '@/state/appData/appDataSlice'
import { getCurrentUser } from '@/state/appData/selectors'
import { store } from '@/state/store'
import { Button, Card, Empty, Flex, Input, Rate } from 'antd'
import { SearchProps } from 'antd/es/input/Search'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import Image from 'next/image'
import { getRateAverage } from '@/utils'
import { StarFilled } from '@ant-design/icons'

const { TextArea } = Input

interface IChatDetails {
  chat: IChat
}

interface IUserReview {
  rate: number
  message: string
  userId: string
  date: string
}

const { Search } = Input

export const ChatDetails: React.FC<IChatDetails> = ({ chat }) => {
  const currentDate = new Date()
  const dateCreated = format(currentDate, 'dd-MM-yyyy')
  const router = useRouter()
  const currentUser = useSelector(getCurrentUser)
  const [userReview, setUserReview] = useState<IUserReview>({
    rate: 1,
    message: '',
    userId: currentUser._id,
    date: dateCreated,
  })

  const chatUsers = chat.users.map((userId) => {
    const user = UserFlow.userList[userId]

    return user
  })

  const [managedUsers, setManagedtUsers] = useState(chatUsers)

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value)
  const onChange = (e: any) => {
    const { value } = e.target
    const usersFound = chatUsers.filter((user) => user.name.includes(value))
    setManagedtUsers(usersFound)
  }

  const handleReview = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/add-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review: userReview, chatId: chat._id }),
      })

      const data = await res.json()

      if (data.chat === null) {
        alert(data.message)
      }

      if (data.chat === undefined || data.ok === false) {
        return
      }

      setUserReview({
        rate: 1,
        message: '',
        userId: currentUser._id,
        date: dateCreated,
      })
      store.dispatch(updateChatById({ ...data.chat }))
      ChatFlow.chatList[data.chat._id] = { ...data.chat }
    } catch (error) {
      return error
    }
  }

  if (chat.reviews === undefined) {
    return
  }

  return (
    <Flex vertical gap={20}>
      <Flex gap={10} align="center">
        <span className="title">Name: </span>
        <span>{chat.name}</span>
      </Flex>

      <Flex gap={10} align="center">
        <span className="title">Category: </span>
        <span>{chat.category}</span>
      </Flex>

      <Flex gap={10} align="center">
        <span className="title">Vizibilty: </span>
        <span>{chat.vizibility.charAt(0).toUpperCase() + chat.vizibility.slice(1)}</span>
      </Flex>

      <Flex gap={10} align="center">
        <span className="title">Owner: </span>
        <span>
          <Link href={`/my-account/${UserFlow.userList[chat.creator]._id}`}>
            {UserFlow.userList[chat.creator].name}
          </Link>
        </span>
      </Flex>

      <Flex gap={10} align="center">
        <span className="title">Created: </span>
        <span>{chat.dateCreated}</span>
      </Flex>

      <Flex gap={10} align="center">
        <span className="title">Reviews average: </span>

        {getRateAverage(chat.reviews) !== 0 ? (
          <span>
            {getRateAverage(chat.reviews)} <StarFilled style={{ color: 'gold' }} />
          </span>
        ) : (
          <span>No reviews yet</span>
        )}
      </Flex>

      <Flex gap={10} style={{ paddingBottom: 30 }}>
        <span className="title">Description: </span>
        <span>{chat.description}</span>
      </Flex>

      <Flex
        vertical
        gap={10}
        style={{ width: '90%', borderTop: '1px solid #EDEDED', paddingTop: 30 }}
      >
        <Flex align="center" gap={20}>
          <span className="title">Review this chat: </span>
          <Flex style={{ width: '90%' }} justify="space-between" align="center">
            <Rate
              onChange={(rate) => setUserReview({ ...userReview, rate: rate })}
              allowHalf
              defaultValue={userReview.rate}
              value={userReview.rate}
            />
            <Button type="primary" onClick={handleReview}>
              Send review
            </Button>
          </Flex>
        </Flex>

        <Flex>
          <Flex style={{ width: '75%' }} gap={15}>
            <TextArea
              value={userReview.message}
              style={{ height: 100 }}
              onChange={(e) => setUserReview({ ...userReview, message: e.target.value })}
              placeholder="Write your review ..."
            />
          </Flex>
        </Flex>
      </Flex>

      <Flex style={{ marginTop: 20 }}>
        {chat.reviews !== undefined && chat.vizibility !== 'private' ? (
          <Flex vertical style={{ width: '90%' }}>
            <Flex
              justify="space-between"
              align="center"
              style={{ borderBottom: '1px solid #EFEFEF', padding: '10px 0px' }}
            >
              <span style={{ fontSize: '16px', fontWeight: 600 }}>Reviews</span>
            </Flex>
            <Flex vertical gap={20} style={{ padding: 10, maxHeight: 300, overflowY: 'scroll' }}>
              {chat.reviews.length > 0 ? (
                chat.reviews.map((review, index) => (
                  <Flex gap={10} vertical key={index} align="space-between" justify="center">
                    <Flex justify="space-between" align="start">
                      <Flex align="center" gap={10}>
                        <Flex>
                          <Image
                            width={35}
                            height={35}
                            src={UserFlow.userList[review.userId].photo}
                            style={{ borderRadius: '50%' }}
                            alt={''}
                          />
                        </Flex>
                        <Flex vertical>
                          <span>{UserFlow.userList[review.userId].name}</span>
                          <span style={{ fontSize: 10 }}>{review.date}</span>
                        </Flex>
                      </Flex>
                      <Flex>
                        <Rate value={review.rate} disabled={true} />
                      </Flex>
                    </Flex>
                    <Flex style={{ marginLeft: 45 }}>{review.message}</Flex>
                  </Flex>
                ))
              ) : (
                <Empty description="No reviews yet" />
              )}
            </Flex>
          </Flex>
        ) : null}
      </Flex>

      <Flex style={{ marginTop: 50 }} vertical gap={40}>
        <Flex vertical gap={10} style={{ width: '90%' }}>
          <Flex
            justify="space-between"
            align="center"
            style={{ borderBottom: '1px solid #EFEFEF', padding: '10px 0px' }}
          >
            <span style={{ fontSize: '16px', fontWeight: 600 }}>Users subscribed</span>
            <Search
              onChange={onChange}
              placeholder="Search user"
              onSearch={onSearch}
              style={{ width: '40%' }}
            />
          </Flex>
          <Flex vertical gap={20} style={{ padding: 10, maxHeight: 300, overflowY: 'scroll' }}>
            {managedUsers.length > 0 ? (
              managedUsers.map((user) => (
                <Flex key={user._id} justify="space-between" align="center">
                  <Flex align="center" gap={10}>
                    <Flex>
                      <Image
                        width={35}
                        height={35}
                        src={user.photo}
                        style={{ borderRadius: '50%' }}
                        alt={''}
                      />
                    </Flex>

                    <span>{user.name}</span>
                  </Flex>

                  <Button onClick={() => router.push(`/my-account/${user._id}`)} type="primary">
                    View Profile
                  </Button>
                </Flex>
              ))
            ) : (
              <Empty description="No users subscribed yet" />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
