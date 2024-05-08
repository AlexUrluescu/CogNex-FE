import { CollapsibleSection } from '@/components/collapsibleSection'
import { IChat } from '@/domain/chat'
import { IUser } from '@/domain/user'
import { ChatFlow } from '@/flows/chat'
import { UserFlow } from '@/flows/users'
import { getAllUsers, getChatsAsCreator, getCurrentUser } from '@/state/appData/selectors'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Flex, Progress, ProgressProps, Select } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import Link from 'next/link'
import { CustomChatWithRate } from '@/components/dashboard/CustomChatWithRate'

export const DashboardView = () => {
  const currentUser = useSelector(getCurrentUser)
  const myChatsAsCreator = useSelector(getChatsAsCreator(currentUser._id))
  const myPrivateChats = myChatsAsCreator.filter((chat) => chat.vizibility === 'private')
  const myPublicChats = myChatsAsCreator.filter((chat) => chat.vizibility === 'public')
  const [userSelected, setUserSelected] = useState<IUser>()
  const [userSelectedChats, setUserSelectedChats] = useState<IChat[]>([])
  const allUsers = useSelector(getAllUsers)
  const router = useRouter()

  const allUsersForSearch = allUsers
    .map((user) => {
      const obj = {
        value: user._id,
        label: user.name,
        id: user._id,
      }

      return obj
    })
    .filter((user) => user.id !== currentUser._id)

  console.log(myPublicChats)
  function calculateTotalUsers(array: IChat[]) {
    let totalUsers = 0
    array.forEach((obj) => {
      totalUsers += obj.users.length
    })
    return totalUsers
  }
  const twoColors: ProgressProps['strokeColor'] = {
    '0%': '#108ee9',
    '100%': '#87d068',
  }

  const totalUsers = calculateTotalUsers(myPublicChats)

  const onChange = (value: string) => {
    console.log('value', value)
    const user = UserFlow.userList[value]

    console.log('user', user)
    setUserSelected(user)

    const chats = ChatFlow.getChatsByCreatorId(value)
    setUserSelectedChats(chats)

    // router.push(`/my-account/${value}`)
  }

  const onSearch = (value: string) => {
    router.push(`/my-account/${value}`)
  }

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  return (
    <Flex vertical gap={35}>
      <Flex gap={20} style={{ padding: 20, width: '100%' }}>
        <Flex
          align="center"
          vertical
          style={{
            padding: 20,
            width: '33%',
            borderRadius: 8,
            height: 180,
            border: '1px solid #F1F0F0',
          }}
        >
          <h4 style={{ height: '20%', fontWeight: 400 }}>Public</h4>
          <Flex justify="center" align="center" style={{ height: '80%', width: '100%' }}>
            <span style={{ fontSize: 45 }}> {myPublicChats.length}</span>
          </Flex>
        </Flex>
        <Flex
          align="center"
          vertical
          style={{
            padding: 20,
            width: '33%',
            borderRadius: 8,
            height: 180,
            border: '1px solid #F1F0F0',
          }}
        >
          <h4 style={{ height: '20%', fontWeight: 400 }}>Private</h4>
          <Flex justify="center" align="center" style={{ height: '80%', width: '100%' }}>
            <span style={{ fontSize: 45 }}> {myPrivateChats.length}</span>
          </Flex>
        </Flex>

        <Flex
          align="center"
          vertical
          style={{
            padding: 20,
            width: '33%',
            borderRadius: 8,
            height: 180,
            border: '1px solid #F1F0F0',
          }}
        >
          <h4 style={{ height: '20%', fontWeight: 400 }}>Users</h4>
          <Flex justify="center" align="center" style={{ height: '80%', width: '100%' }}>
            <span style={{ fontSize: 45 }}> {totalUsers}</span>
          </Flex>
        </Flex>
      </Flex>

      <Flex vertical gap={50} style={{ padding: 20 }}>
        <Flex vertical style={{ border: '1px solid #F1F0F0', borderRadius: 8 }}>
          <Flex style={{ padding: 20 }} gap={20}>
            <h2 style={{ fontWeight: 400 }}>Explore</h2>
            <Select
              style={{ width: '80%' }}
              showSearch={true}
              placeholder="Find your next friend"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={allUsersForSearch}
            />
          </Flex>
          <Flex vertical gap={25}>
            <Flex style={{ padding: 20, overflowX: 'scroll' }} gap={30}>
              {userSelected ? (
                userSelectedChats.length > 0 ? (
                  userSelectedChats.map((chat) => <CustomChatWithRate key={chat._id} chat={chat} />)
                ) : (
                  <Flex justify="center" style={{ color: 'red', width: '100%' }}>
                    <span> This user has no public chats available</span>
                  </Flex>
                )
              ) : (
                <Flex justify="center" style={{ width: '100%' }}>
                  <Empty description="No user selected" />
                </Flex>
              )}
            </Flex>

            {userSelected !== undefined ? (
              <CollapsibleSection title={`${userSelected?.name} details`}>
                <Flex
                  style={{
                    border: '1px solid #F1F0F0',
                    borderRadius: 8,
                    padding: 20,
                    width: '100%',
                  }}
                  vertical
                  gap={20}
                >
                  <Flex
                    justify="space-between"
                    style={{ borderBottom: '1px solid #F1F0F0', paddingBottom: 10 }}
                  >
                    <Flex gap={15}>
                      <InfoCircleOutlined style={{ fontSize: 25 }} />
                      <span style={{ fontSize: 20 }}>Info</span>
                    </Flex>
                    <Flex>
                      <Image
                        width={35}
                        height={35}
                        src={userSelected.photo}
                        style={{ borderRadius: '50%' }}
                        alt={''}
                      />
                    </Flex>
                  </Flex>
                  <Flex align="center">
                    <span className="title2">Name: </span>
                    <Link href={`/my-account/${userSelected._id}`}>{userSelected.name}</Link>
                  </Flex>

                  <Flex align="center">
                    <span className="title2">Email: </span>
                    <span>{userSelected.email}</span>
                  </Flex>
                  <Flex align="center">
                    <span className="title2">Age: </span>
                    <span>{userSelected.age}</span>
                  </Flex>
                </Flex>
              </CollapsibleSection>
            ) : null}
          </Flex>
        </Flex>
        {/* <Flex vertical>
          <Flex style={{ padding: 20 }}>
            <h2 style={{ fontWeight: 400 }}>Public Chats</h2>
          </Flex>
          <Flex style={{ padding: 20 }} gap={30}>
            {myPublicChats.length > 0 ? (
              myPublicChats.map((chat) => <CustomChat key={chat._id} chat={chat} />)
            ) : (
              <span>No public chats created</span>
            )}
          </Flex>
        </Flex>
        <Flex vertical>
          <Flex style={{ padding: 20 }}>
            <h2 style={{ fontWeight: 400 }}>Private Chats</h2>
          </Flex>
          <Flex style={{ padding: 20 }} gap={30}>
            {myPrivateChats.length > 0 ? (
              myPrivateChats.map((chat) => <CustomChat key={chat._id} chat={chat} />)
            ) : (
              <span>No private chats created</span>
            )}
          </Flex>
        </Flex> */}
        {/* <Card title={<h2>My knowledge</h2>}>
          <Flex>
            {currentUser.files?.map((file, index) => (
              <Flex key={index}>
                <span>{file}</span>
              </Flex>
            ))}
          </Flex>
        </Card> */}
      </Flex>
    </Flex>
  )
}
