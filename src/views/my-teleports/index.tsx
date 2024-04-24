import { getCurrentUser, getTeleportsAsCreator } from '@/state/appData/selectors'
import { Button, Card, Flex } from 'antd'
import { useRouter } from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'

export const MyTeleportsView = () => {
  const router = useRouter()
  const currentUser = useSelector(getCurrentUser)
  const myTeleportAsCreator = useSelector(getTeleportsAsCreator(currentUser._id))
  console.log('myTeleportAsCreator', myTeleportAsCreator)

  return (
    <Flex vertical>
      <Card title="My teleports">
        {myTeleportAsCreator.length > 0 ? (
          myTeleportAsCreator.map((tel) => (
            <Card style={{ width: 180 }}>
              <Flex vertical gap={20}>
                <Flex justify="center" style={{ borderBottom: '1px solid gray', padding: 10 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: tel.color,
                      borderRadius: '50%',
                    }}
                  ></div>
                </Flex>
                <Flex vertical>
                  <Flex justify="center" gap={10}>
                    {tel.name}
                  </Flex>
                  <Flex justify="center">{tel.category}</Flex>
                  <Flex justify="center" style={{ marginTop: 20 }}>
                    <Button type="primary" onClick={() => router.push(`/teleport/${tel._id}`)}>
                      View
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          ))
        ) : (
          <span>No teleport</span>
        )}
      </Card>
    </Flex>
  )
}
