import { getCurrentUser, getTeleportsAsCreator } from '@/state/appData/selectors'
import { Button, Empty, Flex, Tag } from 'antd'
import router from 'next/router'
import React from 'react'
import { useSelector } from 'react-redux'

export const PlaygroundTeleports = () => {
  const currentUser = useSelector(getCurrentUser)
  const myTeleports = useSelector(getTeleportsAsCreator(currentUser._id))

  return (
    <Flex>
      {myTeleports.length > 0 ? (
        <Flex gap={20} wrap="wrap">
          {myTeleports.map((teleport) => (
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
                <Button onClick={() => router.push(`/teleport/${teleport._id}`)} type="primary">
                  View
                </Button>
                {/* <Button onClick={() => setChatSelected(chat)} type="primary">
          Details
        </Button> */}
              </Flex>
            </Flex>
          ))}
        </Flex>
      ) : (
        <Flex justify="center" style={{ width: '100%', padding: 20 }}>
          <Empty
            image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
            imageStyle={{ height: 100 }}
            description={<span>No existing teleports</span>}
          >
            <Button onClick={() => router.push('/teleports')} type="primary">
              Create Now
            </Button>
          </Empty>
        </Flex>
      )}
    </Flex>
  )
}
