import { CustomChat } from '@/components/CustomChat'
import { IUser2 } from '@/domain/user'
import { getChatsAsCreator, getCurrentUser, getTeleportsAsCreator } from '@/state/appData/selectors'
import { UserOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Flex, Input, Select, Tag } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import { countryOptions, occupationOptions } from '@/utils'
import TextArea from 'antd/es/input/TextArea'
import { updateUserById } from '@/state/appData/appDataSlice'
import { useDispatch } from 'react-redux'
import router from 'next/router'

interface IMyAccountView {
  user: IUser2
}

export const MyAccountView: React.FC<IMyAccountView> = ({ user }) => {
  const chats = useSelector(getChatsAsCreator(user._id))
  const currentUser = useSelector(getCurrentUser)
  const teleports = useSelector(getTeleportsAsCreator(user._id))
  const [editProfile, setEditProfile] = useState<boolean>(false)
  const [userEdit, setUserEdit] = useState<IUser2>(user)
  const dispatch = useDispatch()

  const publicChats = chats.filter((chat) => chat.vizibility === 'public')
  const privateChats = chats.filter((chat) => chat.vizibility === 'private')

  const isTheCreator = currentUser._id === user._id

  const handleEdit = () => {
    setEditProfile(true)
  }

  const handleFinish = async () => {
    try {
      if (
        userEdit.name === user.name &&
        userEdit.ocupation === user.ocupation &&
        userEdit.country === user.country &&
        userEdit.description === user.description &&
        userEdit.age === user.age
      ) {
        console.log('intra')
        setEditProfile(false)
        return
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/edit_user`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: userEdit }),
      })

      const data = await res.json()
      console.log('data', data)

      dispatch(updateUserById(data.user))
    } catch (error) {
      return error
    }

    setEditProfile(false)
  }
  const handleChangeCategory = (value: string) => {
    setUserEdit({ ...userEdit, ocupation: value })
  }

  const handleChangeCountry = (value: string) => {
    setUserEdit({ ...userEdit, country: value })
  }

  const handleInputsChange = (e: any) => {
    const { name, value } = e.target

    setUserEdit({ ...userEdit, [name]: value })
  }
  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
  return (
    <Flex vertical gap={30}>
      <Flex align="center">
        <Flex align="center" style={{ width: 60, height: 60 }}>
          <Image width={50} height={50} style={{ borderRadius: '50%' }} src={user.photo} alt={''} />
        </Flex>
        <h1 style={{ fontWeight: 500 }}>{user.name}</h1>
      </Flex>
      <Card>
        <Flex>
          <Flex style={{ width: '90%' }} vertical gap={10}>
            <Flex>
              <span style={{ width: '15%', fontWeight: 600, fontSize: 17 }}>Email:</span>

              <Flex>
                {editProfile ? (
                  <Input style={{ width: 250 }} disabled={true} value={user.email} />
                ) : (
                  <span>{user.email}</span>
                )}
              </Flex>
            </Flex>
            <Flex>
              <span style={{ width: '15%', fontWeight: 600, fontSize: 17 }}>Ocupation:</span>
              <Flex>
                {editProfile ? (
                  <Select
                    style={{ width: 250, marginLeft: 0 }}
                    defaultValue={userEdit.ocupation}
                    showSearch
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={handleChangeCategory}
                    // onSearch={onSearch}
                    filterOption={filterOption}
                    options={occupationOptions}
                  />
                ) : (
                  <span>{user.ocupation}</span>
                )}
              </Flex>
            </Flex>
            <Flex>
              <span style={{ width: '15%', fontWeight: 600, fontSize: 17 }}>Age:</span>
              <Flex>
                {editProfile ? (
                  <Input
                    type="number"
                    style={{ width: 250 }}
                    onChange={(e: any) => setUserEdit({ ...userEdit, ['age']: e.target.value })}
                    defaultValue={user.age}
                  />
                ) : (
                  <span>{user.age}</span>
                )}
              </Flex>
            </Flex>
            <Flex>
              <span style={{ width: '15%', fontWeight: 600, fontSize: 17 }}>Country:</span>
              <Flex>
                {editProfile ? (
                  <Select
                    style={{ width: 250, marginLeft: 0 }}
                    defaultValue={userEdit.country}
                    placeholder="Select a person"
                    optionFilterProp="children"
                    onChange={handleChangeCountry}
                    // onSearch={onSearch}
                    filterOption={filterOption}
                    options={countryOptions}
                  />
                ) : (
                  <span>{user.country}</span>
                )}
              </Flex>
            </Flex>
            <Flex>
              <span style={{ width: '15%', fontWeight: 600, fontSize: 17 }}>Description:</span>
              <Flex>
                {editProfile ? (
                  <TextArea
                    style={{ width: 250 }}
                    // onChange={handleFormCreateChatChange}
                    name="description"
                    // value={chat.description}
                    defaultValue={userEdit.description}
                    onChange={handleInputsChange}
                  />
                ) : (
                  <span>{user.description}</span>
                )}
              </Flex>
            </Flex>
          </Flex>
          <Flex style={{ width: '10%' }} justify="end">
            {isTheCreator ? (
              <Flex>
                {editProfile === false ? (
                  <Button onClick={handleEdit} type="primary">
                    EDIT
                  </Button>
                ) : (
                  <Button onClick={handleFinish} type="primary">
                    FINISH
                  </Button>
                )}{' '}
              </Flex>
            ) : null}
          </Flex>
        </Flex>
      </Card>

      <Card title={<h2 style={{ fontWeight: 500 }}>Public Chats</h2>}>
        <Flex gap={20}>
          {publicChats.length !== 0 ? (
            publicChats.map((chat) => <CustomChat key={chat._id} chat={chat} />)
          ) : (
            <Flex justify="center" style={{ width: '100%', padding: 15 }}>
              <Empty description="No public chats available" />
            </Flex>
          )}
        </Flex>
      </Card>
      {isTheCreator ? (
        <Flex vertical gap={30}>
          <Card
            style={{ width: '100%' }}
            title={<h2 style={{ fontWeight: 500 }}>Private Chats</h2>}
          >
            <Flex gap={20}>
              {privateChats.length !== 0 ? (
                privateChats.map((chat) => <CustomChat key={chat._id} chat={chat} />)
              ) : (
                <Flex justify="center" style={{ width: '100%', padding: 15 }}>
                  <Empty description="No private chats available" />
                </Flex>
              )}
            </Flex>
          </Card>
          <Card style={{ width: '100%' }} title={<h2 style={{ fontWeight: 500 }}>Teleports</h2>}>
            <Flex gap={20}>
              {teleports.length !== 0 ? (
                teleports.map((teleport) => (
                  <Flex
                    key={teleport._id}
                    align="center"
                    vertical
                    gap={10}
                    style={{
                      // backgroundColor: 'red',
                      padding: 20,
                      minWidth: 200,
                      maxWidth: 250,
                      borderRadius: 8,
                      height: 180,
                      border: '1px solid #F1F0F0',
                    }}
                  >
                    <Flex justify="center" gap={10} style={{ paddingBottom: 10 }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          backgroundColor: teleport.color,
                        }}
                      ></div>
                      <h4 style={{ height: '20%', fontWeight: 400, textAlign: 'center' }}>
                        {teleport.name}
                      </h4>
                    </Flex>
                    <Flex justify="center">
                      <Tag color="purple">{teleport.category}</Tag>
                    </Flex>

                    <Flex
                      gap={10}
                      justify="center"
                      align="center"
                      style={{ width: '100%', marginTop: 30 }}
                    >
                      <Button
                        onClick={() => router.push(`/teleport/${teleport._id}`)}
                        type="primary"
                      >
                        View
                      </Button>
                      {/* <Button onClick={() => setChatSelected(chat)} type="primary">
                  Details
                </Button> */}
                    </Flex>
                  </Flex>
                ))
              ) : (
                <Flex justify="center" style={{ width: '100%', padding: 15 }}>
                  <Empty description="No teleports available" />
                </Flex>
              )}
            </Flex>
          </Card>
        </Flex>
      ) : null}
    </Flex>
  )
}
