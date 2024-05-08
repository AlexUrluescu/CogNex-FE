import { ITeleport, ITeleport2 } from '@/domain/teleports'
import { TeleportsFlow } from '@/flows/teleports'
import { UserFlow } from '@/flows/users'
import { categoryOptions } from '@/utils'
import { Button, Flex, Input, Popconfirm, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

interface ITeleportSettings {
  teleport: ITeleport2
}

export const TeleportSettings: React.FC<ITeleportSettings> = ({ teleport }) => {
  const [editDetails, setEditDetails] = useState<boolean>(false)
  const router = useRouter()

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const handleEditDetails = () => {
    setEditDetails(true)
  }

  const handleFinishDetails = () => {
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

  return (
    <Flex vertical gap={40}>
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
              <Input style={{ width: '85%' }} defaultValue={teleport.name}></Input>
            ) : (
              <span>{teleport.name}</span>
            )}
          </Flex>

          <Flex gap={10} align="start">
            <span className="title">Category: </span>
            {editDetails === true ? (
              <Select
                style={{ width: 200 }}
                defaultValue={teleport.category}
                showSearch
                placeholder="Select a person"
                optionFilterProp="children"
                //   onChange={handleChangeCategory}
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
        <span>{teleport.vizibility.charAt(0).toUpperCase() + chat.vizibility.slice(1)}</span>
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

          <Flex gap={10}>
            <span className="title">Description: </span>
            {editDetails === true ? (
              <TextArea
                style={{ width: '85%' }}
                // onChange={handleFormCreateChatChange}
                name="description"
                // value={chat.description}
                defaultValue={teleport.description}
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
