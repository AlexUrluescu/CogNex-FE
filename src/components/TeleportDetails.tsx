import { ITeleport } from '@/domain/teleports'
import { ChatFlow } from '@/flows/chat'
import { TeleportsFlow } from '@/flows/teleports'
import { UserFlow } from '@/flows/users'
import { Button, Flex, Tag } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Image from 'next/image'
import { User } from '@/domain/user'
import { WarningFilled, WarningOutlined } from '@ant-design/icons'

interface ITeleportDetails {
  teleport: ITeleport
}

export const TeleportDetails: React.FC<ITeleportDetails> = ({ teleport }) => {
  const router = useRouter()

  if (teleport._id === undefined) {
    return
  }

  const myChats = teleport.chats.filter(
    (chat) => ChatFlow.chatList[chat].creator === teleport.creator
  )

  const otherTeleportedChats = teleport.chats.filter(
    (chat) => ChatFlow.chatList[chat].creator !== teleport.creator
  )

  return (
    <Flex vertical gap={20}>
      <Flex gap={10} align="center">
        <span className="title">Name: </span>
        <span>{teleport.name}</span>
      </Flex>

      <Flex gap={10} align="center">
        <span className="title">Category: </span>
        <span>{teleport.category}</span>
      </Flex>

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

      <Flex gap={10}>
        <span className="title">Description: </span>
        <span>{teleport.description}</span>
      </Flex>

      <Flex gap={10} align="center">
        <span className="title">User teleported: </span>
        <span>
          {' '}
          <Link href={`/my-account/${UserFlow.userList[teleport.teleportUser]._id}`}>
            {UserFlow.userList[teleport.teleportUser].name}
          </Link>
        </span>
      </Flex>

      <Flex gap={10} align="start">
        <span className="title">Chats teleported: </span>
        <Flex>
          <Flex gap={15}>
            {teleport.chats.map((chat) => {
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
                    minWidth: 200,
                    maxWidth: 250,
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
                    {chatFound.vizibility === 'private' ? (
                      <WarningFilled style={{ color: 'red' }} />
                    ) : null}
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
                    {/* <Button onClick={() => setChatSelected(chat)} type="primary">
                Details
              </Button> */}
                  </Flex>
                </Flex>
              )
            })}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
