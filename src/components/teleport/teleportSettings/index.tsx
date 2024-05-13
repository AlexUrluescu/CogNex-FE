import { ITeleport, ITeleport2 } from '@/domain/teleports'
import { TeleportsFlow } from '@/flows/teleports'
import { UserFlow } from '@/flows/users'
import { categoryOptions } from '@/utils'
import { Button, Card, ColorPicker, Flex, Input, Popconfirm, Select, Spin, Tag } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Image from 'next/image'
import { ChatFlow } from '@/flows/chat'
import { useDispatch } from 'react-redux'
import { updateChatById, updateTeleportById } from '@/state/appData/appDataSlice'
import { WarningFilled } from '@ant-design/icons'

interface ITeleportSettings {
  teleport: ITeleport2
}

export const TeleportSettings: React.FC<ITeleportSettings> = ({ teleport }) => {
  const [editDetails, setEditDetails] = useState<boolean>(false)
  const [editDocuments, setEditDocuments] = useState<boolean>(false)
  const [addDocuments, setAddDocuments] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [teleportEdit, setTeleportEdit] = useState<ITeleport>(teleport)

  const dispatch = useDispatch()

  const router = useRouter()

  const handleEditDocuments = () => {
    setEditDocuments(true)
  }

  const handleFinishDocuments = () => {
    setEditDocuments(false)
  }

  const handleAddDocuments = () => {
    setAddDocuments(true)
  }

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const handleEditDetails = () => {
    setEditDetails(true)
  }

  const handleFinishDetails = async () => {
    console.log(teleportEdit)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/edit_teleport`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teleport: teleportEdit }),
      })

      const data = await res.json()
      console.log('data', data)

      dispatch(updateTeleportById(data.teleport))
    } catch (error) {
      return error
    }

    setEditDetails(false)
  }

  const handleDelete = async (teleportId: string) => {
    try {
      const teleportDeletedId = await TeleportsFlow.deleteTeleport(teleportId)
      if (teleportDeletedId) {
        router.push('/playground')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChatDelete = async (chatId: string, teleportId: string) => {
    console.log(chatId)
    console.log(teleportId)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_ROUTE}/delete-chat-from-teleport`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId: chatId, teleportId: teleportId }),
      })

      const data = await res.json()
      console.log(data)

      dispatch(updateTeleportById(data.teleport))
    } catch (error) {
      return error
    }
  }

  const handleColorChange = (color: string) => {
    setTeleportEdit({ ...teleportEdit, color: color })
  }

  const handleInputsChange = (e: any) => {
    console.log('name', e.target.name)
    console.log('value', e.target.value)
    const { name, value } = e.target

    setTeleportEdit({ ...teleportEdit, [name]: value })
  }

  const handleChangeCategory = (value: string) => {
    setTeleportEdit({ ...teleportEdit, category: value })
  }

  return (
    <Flex vertical gap={40}>
      <Flex vertical>
        <Flex
          style={{
            borderBottom: '1px solid #ECEBEB',
            padding: '10px 0px',
          }}
          align="center"
          justify="space-between"
        >
          <span style={{ fontSize: 25, fontWeight: 600 }}>Chats</span>
          {editDocuments ? (
            <Flex>
              <Button type="primary" onClick={handleFinishDocuments}>
                FINISH
              </Button>
            </Flex>
          ) : (
            <Flex gap={10}>
              {addDocuments ? (
                <Button type="primary" onClick={() => setAddDocuments(false)}>
                  FINISH
                </Button>
              ) : (
                <Button type="primary" onClick={handleEditDocuments}>
                  EDIT
                </Button>
              )}
            </Flex>
          )}
        </Flex>
        <Flex vertical gap={20} style={{ padding: 20 }}>
          <Flex gap={15}>
            {loading === false ? (
              teleport.chats.map((chat) => {
                const chatFound = ChatFlow.chatList[chat]

                return (
                  <Flex
                    key={chatFound._id}
                    align="center"
                    vertical
                    gap={10}
                    style={{
                      // backgroundColor: 'red',
                      padding: 20,
                      minWidth: 220,
                      // maxWidth: 250,
                      borderRadius: 8,
                      // height: 180,
                      border:
                        chatFound.vizibility === 'public' ? '1px solid #F1F0F0' : '1px solid red',
                    }}
                  >
                    <Flex gap={10} align="center" style={{ paddingBottom: 10 }}>
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          backgroundColor: chatFound.color,
                        }}
                      ></div>
                      <span style={{ fontWeight: 400, fontSize: 19 }}>{chatFound.name}</span>
                    </Flex>
                    <Flex justify="center" align="center" gap={10}>
                      <Image
                        width={20}
                        height={20}
                        src={UserFlow.userList[chatFound.creator].photo}
                        style={{ borderRadius: '50%' }}
                        alt={''}
                      />
                      <Tag color="purple">{chatFound.category}</Tag>
                    </Flex>

                    {chatFound.vizibility === 'private' ? (
                      <Flex align="center" gap={5} style={{ height: 10, marginTop: 15 }}>
                        <WarningFilled style={{ color: 'red' }} />
                        This chat becomes private
                      </Flex>
                    ) : (
                      <div style={{ height: 10, marginTop: 15 }}></div>
                    )}

                    <Flex
                      gap={10}
                      justify="center"
                      align="center"
                      style={{ width: '100%', marginTop: 30 }}
                    >
                      <Button
                        onClick={() => router.push(`/public-chats/${chatFound._id}`)}
                        type="primary"
                        disabled={chatFound.vizibility === 'private'}
                      >
                        View
                      </Button>

                      {editDocuments ? (
                        <Popconfirm
                          title={`Delete the ${chatFound.name} chat`}
                          description="Are you sure to delete this chat?"
                          onConfirm={() => handleChatDelete(chatFound._id, teleport._id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button type="primary" danger>
                            Delete
                          </Button>
                        </Popconfirm>
                      ) : null}
                    </Flex>
                  </Flex>
                )
              })
            ) : (
              <Spin size="large" />
            )}
          </Flex>
          {addDocuments ? (
            <Flex vertical gap={10}>
              upload
              {/* <DraggerUpload setFile={setFiles} file={files} onChange={onChange} />
              <Button disabled={!btnUploadDisabled} type="primary" onClick={handleCreateChat}>
                UPLOAD
              </Button> */}
            </Flex>
          ) : null}
        </Flex>
      </Flex>
      <Flex vertical gap={10}>
        <Flex
          style={{
            borderBottom: '1px solid #ECEBEB',
            padding: '10px 0px',
          }}
          align="center"
          justify="space-between"
        >
          <span style={{ fontSize: 25, fontWeight: 600 }}>Details</span>

          {editDetails ? (
            <Button type="primary" onClick={handleFinishDetails}>
              FINISH
            </Button>
          ) : (
            <Button type="primary" onClick={handleEditDetails}>
              EDIT
            </Button>
          )}
        </Flex>
        <Flex vertical gap={15} style={{ padding: 10 }}>
          <Flex gap={10} align="start">
            <span className="title">Name: </span>
            {editDetails === true ? (
              <Input
                style={{ width: '85%' }}
                name="name"
                onChange={handleInputsChange}
                defaultValue={teleportEdit.name}
              ></Input>
            ) : (
              <span>{teleport.name}</span>
            )}
          </Flex>

          <Flex gap={10} align="start">
            <span className="title">Category: </span>
            {editDetails === true ? (
              <Select
                style={{ width: 200, marginLeft: -10 }}
                defaultValue={teleportEdit.category}
                showSearch
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={handleChangeCategory}
                // onSearch={onSearch}
                filterOption={filterOption}
                options={categoryOptions}
              />
            ) : (
              <span>{teleport.category}</span>
            )}
          </Flex>

          {/* <Flex gap={10} align="center">
            <span className="title">Vizibilty: </span>
            <span>{chat.vizibility.charAt(0).toUpperCase() + chat.vizibility.slice(1)}</span>
          </Flex> */}

          <Flex gap={10} align="center">
            <span className="title">Owner: </span>
            <span>
              <Link href={`/my-account/${UserFlow.userList[teleport.creator]._id}`}>
                {UserFlow.userList[teleport.creator].name}
              </Link>
            </span>
          </Flex>

          <Flex gap={10} align="center">
            <span className="title">Created: </span>
            <span>{teleport.dateCreated}</span>
          </Flex>

          <Flex>
            <span className="title">Color: </span>
            {editDetails === true ? (
              <ColorPicker
                onChange={(color_, hex) => handleColorChange(hex)}
                defaultValue={teleport.color}
                showText
              />
            ) : (
              <div
                style={{
                  backgroundColor: teleport.color,
                  width: 25,
                  height: 25,
                  borderRadius: '50%',
                  marginLeft: 10,
                }}
              ></div>
            )}
          </Flex>

          <Flex gap={10}>
            <span className="title">Description: </span>
            {editDetails === true ? (
              <TextArea
                style={{ width: '85%' }}
                // onChange={handleFormCreateChatChange}
                name="description"
                // value={chat.description}
                defaultValue={teleportEdit.description}
                onChange={handleInputsChange}
              />
            ) : (
              // <Input style={{ width: '85%' }} defaultValue={chat.description}></Input>
              <span>{teleport.description}</span>
            )}
          </Flex>
        </Flex>
      </Flex>
      <Flex vertical>
        <Flex
          style={{
            borderBottom: '1px solid #ECEBEB',
            padding: '10px 0px',
          }}
          align="center"
          justify="space-between"
        >
          <span style={{ fontSize: 25, fontWeight: 500, color: 'red' }}>Danger Zone</span>
        </Flex>
        <Flex
          justify="space-between"
          align="center"
          style={{ border: '1px solid red', borderRadius: 8, padding: 10 }}
        >
          <Flex vertical>
            <p style={{ fontWeight: 600 }}>Delete this teleport</p>
            <p>Once you delete a teleport, there is no going back. Please be certain.</p>
          </Flex>

          <Popconfirm
            title={`Delete ${teleport.name} teleport`}
            description="Are you sure to delete this teleport?"
            onConfirm={() => handleDelete(teleport._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger>
              DELETE
            </Button>
          </Popconfirm>
        </Flex>
      </Flex>
    </Flex>
  )
}
