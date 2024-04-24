import { ITeleport } from '@/domain/teleports'
import { ChatFlow } from '@/flows/chat'
import { TeleportsFlow } from '@/flows/teleports'
import { UserFlow } from '@/flows/users'
import { Flex } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

interface ITeleportDetails {
  teleport: ITeleport
}

export const TeleportDetails: React.FC<ITeleportDetails> = ({ teleport }) => {
  const router = useRouter()

  console.log('teleport', teleport)

  if (teleport._id === undefined) {
    return
  }

  const myChats = teleport.chats.filter(
    (chat) => ChatFlow.chatList[chat].creator === teleport.creator
  )

  const otherTeleportedChats = teleport.chats.filter(
    (chat) => ChatFlow.chatList[chat].creator !== teleport.creator
  )

  console.log('myChats', myChats)

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
            {UserFlow.userList[teleport.creator].firstName}{' '}
            {UserFlow.userList[teleport.creator].lastName}
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
          {UserFlow.userList[teleport.teleportUser].firstName}{' '}
          {UserFlow.userList[teleport.teleportUser].lastName}
        </span>
      </Flex>

      <Flex gap={10} align="start">
        <span className="title">Chats teleported: </span>
        <Flex style={{ width: '80%', padding: 0, backgroundColor: 'red' }}>
          <Flex gap={20} style={{ width: '40%', backgroundColor: 'blue' }}>
            <div style={{ width: 30, height: 30, backgroundColor: 'violet', borderRadius: '50%' }}>
              image
            </div>
            <Flex vertical>
              {myChats.map((chat) => {
                const chatFound = ChatFlow.chatList[chat]

                return (
                  <Flex
                    key={chatFound._id}
                    gap={15}
                    align="center"
                    style={{ border: '1px solid gray', padding: 5 }}
                  >
                    <div
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: '50%',
                        backgroundColor: chatFound.color,
                      }}
                    ></div>
                    <span>{chatFound.name}</span>
                  </Flex>
                )
              })}
            </Flex>
          </Flex>
          <Flex gap={15} justify="end" style={{ width: '40%', backgroundColor: 'pink' }}>
            <Flex vertical>
              {otherTeleportedChats.map((chat) => {
                const chatFound = ChatFlow.chatList[chat]

                return (
                  <Flex
                    key={chatFound._id}
                    gap={15}
                    align="center"
                    style={{ border: '1px solid gray', padding: 5 }}
                  >
                    <div
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: '50%',
                        backgroundColor: chatFound.color,
                      }}
                    ></div>
                    <span>{chatFound.name}</span>
                  </Flex>
                )
              })}
            </Flex>
            <div style={{ width: 30, height: 30, backgroundColor: 'violet', borderRadius: '50%' }}>
              image
            </div>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
