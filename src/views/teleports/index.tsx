import { CustomChat } from '@/components/CustomChat'
import { IChat } from '@/domain/chat'
import { ChatFlow } from '@/flows/chat'
import { UserFlow } from '@/flows/users'
import { getAllUsers, getChatsAsCreator, getCurrentUser } from '@/state/appData/selectors'
import {
  Button,
  Card,
  Checkbox,
  ColorPicker,
  Empty,
  Flex,
  Input,
  Radio,
  RadioChangeEvent,
  Select,
  Spin,
  Tag,
  message,
} from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { CheckboxProps, Modal } from 'antd'
import { CollapsibleSection } from '@/components/collapsibleSection'
import { CloseCircleOutlined } from '@ant-design/icons'
import { format } from 'date-fns'
import { ITeleport } from '@/domain/teleports'
import { TeleportsFlow } from '@/flows/teleports'
import Image from 'next/image'
import { categoryOptions } from '@/utils'

const testColor = '#C0BFBF'
const { TextArea } = Input

interface IChatFormValues {
  name: string
  category: string
  description: string
  color: string
}

export const TeleportsView = () => {
  const currentUser = useSelector(getCurrentUser)
  const allUsers = useSelector(getAllUsers)
  const [availablePublicChats, setAvailablePublicChats] = useState<IChat[]>([])
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [chatsSelected, setChatsSelected] = useState<string[]>([])
  const [myChatsSelected, setMyChatsSelected] = useState<string[]>([])
  const [userSelected, setUserSelected] = useState<string>('')

  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [modalText, setModalText] = useState('Content of the modal')
  const [teleportFormValues, setTeleportFormValues] = useState<IChatFormValues>({
    name: '',
    category: '',
    description: '',
    color: '',
  })
  const [messageApi, contextHolder] = message.useMessage()

  const successUnsubscribed = () => {
    messageApi.open({
      type: 'success',
      content: 'Your teleport was created successfully',
    })
  }

  const showModal = () => {
    setOpen(true)
  }
  const handleOk = async () => {
    setLoading(true)
    const allChatsSelected = [...chatsSelected, ...myChatsSelected]
    const currentDate = new Date()
    const dateCreated = format(currentDate, 'dd-MM-yyyy')

    const userSelectedId = UserFlow.userList[userSelected]._id

    const finalTeleportObject: ITeleport = {
      creator: currentUser._id,
      chats: allChatsSelected,
      name: teleportFormValues.name,
      category: teleportFormValues.category,
      description: teleportFormValues.description,
      dateCreated: dateCreated,
      teleportUser: userSelectedId !== undefined ? userSelectedId : '',
      color: teleportFormValues.color === '' ? '#0ce81a' : teleportFormValues.color,
    }

    const newTeleport = await TeleportsFlow.createNewTeleport(finalTeleportObject)

    if (newTeleport) {
      setLoading(false)
      setOpen(false)
      setMyChatsSelected([])
      setChatsSelected([])
      successUnsubscribed()
    }
  }

  const handleCancel = () => {
    setTeleportFormValues({ name: '', category: '', description: '', color: '#4287f5' })

    setOpen(false)
  }

  const myChats = useSelector(getChatsAsCreator(currentUser._id))
  // const publicChats = myChats.filter((chat) => chat.vizibility === 'public')

  const allUsersForSearch = allUsers.map((user) => {
    const obj = {
      value: user._id,
      label: user.name,
      id: user._id,
    }

    return obj
  })

  const onChange = (value: string) => {
    setUserSelected(value)
    const chats = ChatFlow.getChatsByCreatorId(value)

    const publicChats = chats.filter((chat) => chat.vizibility === 'public')

    setAvailablePublicChats(publicChats)
  }

  const onSearch = (value: string) => {
    // router.push(`/my-account/${value}`)
    // console.log(value)
  }

  const onChange2: CheckboxProps['onChange'] = (e) => {
    const checked = e.target.checked

    if (checked) {
      setChatsSelected([...chatsSelected, e.target.value])
    } else {
      const filteredChats = chatsSelected.filter((id) => id !== e.target.value)
      setChatsSelected(filteredChats)
    }
  }

  const onChange3: CheckboxProps['onChange'] = (e) => {
    const checked = e.target.checked

    if (checked) {
      setMyChatsSelected([...myChatsSelected, e.target.value])
    } else {
      const filteredChats = myChatsSelected.filter((id) => id !== e.target.value)
      setMyChatsSelected(filteredChats)
    }
  }

  const handleFormCreateChatChange = (e: any) => {
    const { value, name } = e.target

    setTeleportFormValues({ ...teleportFormValues, [name]: value })
  }

  const handleChangeCategory = (value: string) => {
    setTeleportFormValues({ ...teleportFormValues, ['category']: value })
  }

  const handleColorChange = (color: string) => {
    setTeleportFormValues({ ...teleportFormValues, color: color })
  }

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
  return (
    <Flex vertical gap={20}>
      {contextHolder}
      <Flex align="center" gap={15}>
        <span>Explore</span>
        <Select
          style={{ width: '100%' }}
          showSearch={true}
          placeholder="Find an user"
          optionFilterProp="children"
          onChange={onChange}
          onSearch={onSearch}
          filterOption={filterOption}
          options={allUsersForSearch}
        />
      </Flex>
      <Flex vertical gap={15} style={{ width: '100%', border: '1px solid #EDEDED' }}>
        <Flex
          style={{
            height: 300,

            padding: 20,
            borderRadius: 8,
            width: '100%',
          }}
        >
          <Flex vertical align="center" style={{ width: '33%' }}>
            <Flex align="center" justify="center" style={{ width: '80%' }} gap={10}>
              <Flex>
                <Image
                  width={35}
                  height={35}
                  style={{ borderRadius: '50%' }}
                  src={currentUser.photo}
                  alt={''}
                />
              </Flex>
              <span>{currentUser.name}</span>
            </Flex>
            <Flex
              vertical
              align="center"
              style={{
                //  backgroundColor: 'red',
                height: '100%',
                width: '100%',
                padding: '20px 0',
              }}
            >
              {myChatsSelected.length !== 0 ? (
                myChatsSelected.map((chat) => (
                  <Flex
                    justify="space-between"
                    style={{
                      // backgroundColor: 'blue',
                      padding: 15,
                      width: '70%',
                      borderRadius: 8,
                      border: '1px solid #EDEDED',
                    }}
                    key={ChatFlow.chatList[chat]._id}
                  >
                    <Flex gap={10}>
                      <div
                        style={{
                          backgroundColor: ChatFlow.chatList[chat].color,
                          height: 20,
                          width: 20,
                          borderRadius: '50%',
                        }}
                      ></div>
                      {ChatFlow.chatList[chat].name}
                    </Flex>
                  </Flex>
                ))
              ) : (
                <Flex justify="center" align="center" style={{ width: '100%', height: '100%' }}>
                  No chats selected
                </Flex>
              )}
            </Flex>
          </Flex>
          <Flex justify="center" style={{ width: '33%' }}>
            <div style={{ marginTop: 100, perspective: 1000, perspectiveOrigin: '50% 50%' }}>
              <div className="cube">
                <div className="front"></div>
                <div className="back"></div>
                <div className="top"></div>
                <div className="bottom"></div>
                <div className="left"></div>
                <div className="right"></div>
              </div>
            </div>
          </Flex>
          <Flex vertical align="center" style={{ width: '33%' }}>
            <Flex>
              {userSelected !== '' ? (
                <Flex align="center" gap={10}>
                  <Flex>
                    <Image
                      width={35}
                      height={35}
                      style={{ borderRadius: '50%' }}
                      src={UserFlow.userList[userSelected].photo}
                      alt={''}
                    />
                  </Flex>
                  <span>{UserFlow.userList[userSelected].name}</span>
                </Flex>
              ) : (
                'No user selected'
              )}
            </Flex>
            <Flex
              vertical
              align="center"
              style={{
                //  backgroundColor: 'red',
                height: '100%',
                width: '100%',
                padding: '20px 0',
              }}
            >
              {chatsSelected.length !== 0 ? (
                chatsSelected.map((chat) => (
                  <Flex
                    justify="space-between"
                    style={{
                      // backgroundColor: 'blue',
                      padding: 15,
                      width: '70%',
                      borderRadius: 8,
                      border: '1px solid #EDEDED',
                    }}
                    key={ChatFlow.chatList[chat]._id}
                  >
                    <Flex gap={10}>
                      <div
                        style={{
                          backgroundColor: ChatFlow.chatList[chat].color,
                          height: 20,
                          width: 20,
                          borderRadius: '50%',
                        }}
                      ></div>
                      {ChatFlow.chatList[chat].name}
                    </Flex>
                  </Flex>
                ))
              ) : (
                <Flex justify="center" align="center" style={{ width: '100%', height: '100%' }}>
                  No chats selected
                </Flex>
              )}
            </Flex>
          </Flex>
        </Flex>
        {myChatsSelected.length !== 0 && chatsSelected.length !== 0 ? (
          <Flex justify="center" style={{ padding: 10 }}>
            <Button onClick={showModal} type="primary">
              Create
            </Button>
          </Flex>
        ) : null}
      </Flex>

      <Flex vertical gap={20}>
        <CollapsibleSection
          title={
            userSelected !== ''
              ? `${UserFlow.userList[userSelected].name}'s chats`
              : 'No user selected'
          }
        >
          <Card>
            <Flex gap={20} style={{ overflowX: 'scroll', padding: '10px 0' }}>
              {availablePublicChats.length !== 0 && userSelected !== '' ? (
                availablePublicChats.map((chat) => {
                  const userAllowed = chat.users.find((userId) => userId === currentUser._id)

                  const isChatOwner = currentUser._id === chat.creator

                  return (
                    <Flex
                      vertical
                      gap={30}
                      key={chat._id}
                      style={{
                        // backgroundColor: 'blue',
                        border: chatsSelected.find((chatId) => chatId === chat._id)
                          ? '1px solid #1677ff'
                          : '1px solid #F1F0F0',
                        padding: '10px',
                        borderRadius: '8px',
                        maxWidth: 250,
                        minWidth: 200,
                      }}
                      align="center"
                    >
                      <Flex style={{ width: '100%' }} vertical>
                        <Flex style={{ width: '100%' }} justify="end">
                          <Checkbox
                            onChange={onChange2}
                            disabled={
                              !!userAllowed === true
                                ? false
                                : true && currentUser._id !== userSelected
                            }
                            value={chat._id}
                            checked={!!chatsSelected.find((id) => id === chat._id)}
                          ></Checkbox>
                        </Flex>
                        <Flex justify="center" style={{ padding: '10px' }} gap={10}>
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: chat.color,
                              borderRadius: '50%',
                            }}
                          ></span>
                          <span>{chat.name}</span>
                        </Flex>
                        <Flex justify="center">
                          <Tag color="cyan">{chat.category}</Tag>
                        </Flex>
                        <div style={{ height: 15, marginTop: 5 }}>
                          {!!userAllowed === false && isChatOwner === false ? (
                            <p style={{ color: 'red', textAlign: 'center', fontSize: 12 }}>
                              You are not subcribed
                            </p>
                          ) : null}
                        </div>
                      </Flex>

                      <Flex align="center" vertical style={{ paddingBottom: 10 }}>
                        <Button
                          type="primary"
                          onClick={() => router.push(`/public-chats/${chat._id}`)}
                        >
                          View
                        </Button>
                      </Flex>
                    </Flex>
                  )
                })
              ) : (
                // <span>No public chats available</span>
                <Flex justify="center" style={{ width: '100%', padding: 15 }}>
                  <Empty description="No user selected" />
                </Flex>
              )}
            </Flex>
          </Card>
        </CollapsibleSection>

        <CollapsibleSection title="My chats">
          <Card>
            <Flex gap={20} style={{ width: '100%', overflowX: 'scroll', padding: '10px 0' }}>
              {myChats.length !== 0 ? (
                myChats.map((chat) => {
                  const userAllowed = chat.users.find((userId) => userId === currentUser._id)

                  const isChatOwner = currentUser._id === chat.creator

                  return (
                    <Flex
                      vertical
                      gap={30}
                      key={chat._id}
                      style={{
                        // backgroundColor: 'blue',
                        border: myChatsSelected.find((chatId) => chatId === chat._id)
                          ? '1px solid #1677ff'
                          : '1px solid #F1F0F0',
                        padding: '10px',
                        borderRadius: '8px',
                        // maxWidth: 250,
                        minWidth: 230,
                      }}
                      align="center"
                    >
                      <Flex style={{ width: '100%' }} vertical>
                        <Flex style={{ width: '100%' }} justify="end">
                          <Checkbox
                            onChange={onChange3}
                            value={chat._id}
                            checked={!!myChatsSelected.find((id) => id === chat._id)}
                          ></Checkbox>
                        </Flex>
                        <Flex justify="center" style={{ padding: '10px' }} gap={10}>
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: chat.color,
                              borderRadius: '50%',
                            }}
                          ></span>
                          <p>{chat.name}</p>
                        </Flex>
                        <Flex justify="center">
                          <Tag color="purple">{chat.category}</Tag>
                        </Flex>
                        <div style={{ height: 15 }}></div>
                      </Flex>

                      <Flex style={{ padding: '10px' }} align="center" vertical>
                        {!!userAllowed === false && isChatOwner === false ? (
                          <span style={{ color: 'red' }}>You are not subcribed</span>
                        ) : null}
                        <Button
                          type="primary"
                          onClick={() => router.push(`/public-chats/${chat._id}`)}
                        >
                          View
                        </Button>
                      </Flex>
                    </Flex>
                  )
                })
              ) : (
                <Flex justify="center" style={{ width: '100%', padding: 15 }}>
                  <Empty description="No chats created" />
                </Flex>
              )}
            </Flex>
          </Card>
        </CollapsibleSection>
      </Flex>

      <style jsx>{`
        .cube {
          margin: auto;
          position: relative;
          height: 100px;
          width: 100px;
          transform-style: preserve-3d;
        }

        .cube > div {
          position: absolute;
          box-sizing: border-box;
          padding: 10px;
          height: 100%;
          width: 100%;

          border: solid 1px #eeeeee;
          color: #ffffff;
        }

        .front {
          transform: translateZ(0px);
          background-color: ${ChatFlow.chatList[myChatsSelected[0]] !== undefined
            ? ChatFlow.chatList[myChatsSelected[0]].color
            : testColor};
        }

        .back {
          transform: translateZ(-100px) rotateY(180deg);
          background-color: ${ChatFlow.chatList[myChatsSelected[2]] !== undefined
            ? ChatFlow.chatList[myChatsSelected[2]].color
            : testColor};
        }

        .right {
          transform: rotateY(-270deg) translateX(100px);
          transform-origin: top right;
          background-color: ${ChatFlow.chatList[chatsSelected[1]] !== undefined
            ? ChatFlow.chatList[chatsSelected[1]].color
            : testColor};
        }

        .left {
          transform: rotateY(270deg) translateX(-100px);
          transform-origin: center left;
          background-color: ${ChatFlow.chatList[myChatsSelected[1]] !== undefined
            ? ChatFlow.chatList[myChatsSelected[1]].color
            : testColor};
        }

        .top {
          transform: rotateX(-270deg) translateY(-100px);
          transform-origin: top center;
          background-color: ${ChatFlow.chatList[chatsSelected[0]] !== undefined
            ? ChatFlow.chatList[chatsSelected[0]].color
            : testColor};
        }

        .bottom {
          transform: rotateX(270deg) translateY(100px);
          transform-origin: bottom center;
          background-color: ${ChatFlow.chatList[chatsSelected[2]] !== undefined
            ? ChatFlow.chatList[chatsSelected[2]].color
            : testColor};
        }

        @keyframes rotate {
          from {
            transform: rotateX(0deg) rotateY(0deg);
          }

          to {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }

        .cube {
          animation: rotate 20s infinite linear;
        }

        .wrap:hover .front {
          transform: translateZ(200px);
        }

        .wrap:hover .back {
          transform: translateZ(-200px) rotateY(180deg);
        }

        .wrap:hover .right {
          transform: rotateY(-270deg) translateZ(100px) translateX(100px);
        }

        .wrap:hover .left {
          transform: rotateY(270deg) translateZ(100px) translateX(-100px);
        }

        .wrap:hover .top {
          transform: rotateX(-270deg) translateZ(100px) translateY(-100px);
        }

        .wrap:hover .bottom {
          transform: rotateX(270deg) translateZ(100px) translateY(100px);
        }

        .cube > div {
          transition: transform 0.2s ease-in;
        }
      `}</style>
      <Modal
        title="CREATE YOUR TELEPORT"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={800}
      >
        {' '}
        {loading === false ? (
          <Flex vertical gap={50} style={{ marginTop: 20 }}>
            <Flex
              justify="space-between"
              align="start"
              style={{
                height: 100,
                // backgroundColor: 'red',
                minHeight: 120,
              }}
            >
              <Flex align="start" gap={20} style={{ width: '50%', height: '100%' }}>
                <Image
                  width={35}
                  height={35}
                  style={{ borderRadius: '50%' }}
                  src={currentUser.photo}
                  alt={''}
                />
                <Flex
                  vertical
                  gap={10}
                  style={{
                    // backgroundColor: 'purple',
                    padding: '0 10px',
                    overflowY: 'scroll',
                    maxHeight: 100,
                  }}
                >
                  {myChatsSelected.length !== 0
                    ? myChatsSelected.map((chat) => (
                        <Flex
                          justify="space-between"
                          align="center"
                          style={{
                            // backgroundColor: 'blue',
                            padding: 5,
                            minWidth: 200,
                            maxWidth: 250,
                            borderRadius: 6,
                            border: '1px solid #EDEDED',
                          }}
                          key={ChatFlow.chatList[chat]._id}
                        >
                          <Flex gap={10}>
                            <div
                              style={{
                                backgroundColor: ChatFlow.chatList[chat].color,
                                height: 20,
                                width: 20,
                                borderRadius: '50%',
                              }}
                            ></div>
                            {ChatFlow.chatList[chat].name}
                          </Flex>
                        </Flex>
                      ))
                    : null}
                </Flex>
              </Flex>
              <Flex
                align="start"
                justify="end"
                gap={20}
                style={{
                  // backgroundColor: 'green',
                  width: '50%',
                  height: '100%',
                }}
              >
                <Flex
                  gap={10}
                  vertical
                  style={{
                    // backgroundColor: 'pink',
                    padding: '0 10px',
                    overflowY: 'scroll',
                    maxHeight: 130,
                  }}
                >
                  {chatsSelected.length !== 0
                    ? chatsSelected.map((chat) => (
                        <Flex
                          justify="space-between"
                          align="center"
                          style={{
                            // backgroundColor: 'blue',
                            padding: 5,
                            minWidth: 200,
                            maxWidth: 250,
                            borderRadius: 6,
                            border: '1px solid #EDEDED',
                          }}
                          key={ChatFlow.chatList[chat]._id}
                        >
                          <Flex gap={10}>
                            <div
                              style={{
                                backgroundColor: ChatFlow.chatList[chat].color,
                                height: 20,
                                width: 20,
                                borderRadius: '50%',
                              }}
                            ></div>
                            {ChatFlow.chatList[chat].name}
                          </Flex>
                        </Flex>
                      ))
                    : null}
                </Flex>
                {userSelected !== '' ? (
                  <Image
                    width={35}
                    height={35}
                    src={UserFlow.userList[userSelected].photo}
                    style={{ borderRadius: '50%' }}
                    alt={''}
                  />
                ) : // <img
                //   style={{ width: 35, height: 35, borderRadius: '50%' }}
                //   src={UserFlow.userList[userSelected].photo}
                // />
                null}
              </Flex>
            </Flex>
            <Flex vertical gap={20}>
              <Flex align="center" gap={10}>
                <span style={{ fontSize: 18, width: '13%' }}>Name</span>
                <Input
                  style={{ width: 200 }}
                  onChange={handleFormCreateChatChange}
                  name="name"
                  value={teleportFormValues.name}
                  placeholder="Name"
                />
              </Flex>
              <Flex align="center" gap={10}>
                <span style={{ fontSize: 18, width: '13%' }}>Category</span>
                <Select
                  style={{ width: 200 }}
                  value={teleportFormValues.category}
                  showSearch
                  placeholder="Select a person"
                  optionFilterProp="children"
                  onChange={handleChangeCategory}
                  onSearch={onSearch}
                  filterOption={filterOption}
                  options={categoryOptions}
                />
              </Flex>
              <Flex align="start" gap={10}>
                <span style={{ fontSize: 18, width: '13%' }}>Color</span>
                <ColorPicker
                  onChange={(color_, hex) => handleColorChange(hex)}
                  defaultValue="#1677ff"
                  showText
                />
              </Flex>
              <Flex align="start" gap={10}>
                <span style={{ fontSize: 18, width: '13%' }}>Description</span>
                <TextArea
                  style={{ width: 400, height: 100 }}
                  onChange={handleFormCreateChatChange}
                  name="description"
                  placeholder="Description"
                  value={teleportFormValues.description}
                />
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Flex justify="center" align="center" style={{ width: '100%', height: 550 }}>
            <Spin size="large" />
          </Flex>
        )}
      </Modal>
    </Flex>
  )
}
