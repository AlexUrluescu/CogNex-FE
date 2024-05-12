import { CreateChat } from '@/components/CreateChat'
import { CustomChat } from '@/components/CustomChat'
import { CollapsibleSection } from '@/components/collapsibleSection'
import { IChat } from '@/domain/chat'
import { ChatFlow } from '@/flows/chat'
import { UserFlow } from '@/flows/users'
import { getAllChats, getCurrentUser } from '@/state/appData/selectors'
import { getRateAverage } from '@/utils'
import { InfoCircleOutlined, StarFilled } from '@ant-design/icons'
import { Button, Empty, Flex, Modal, RadioChangeEvent, Spin, Tag } from 'antd'
import axios from 'axios'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import { useSelector } from 'react-redux'

interface IChatFormValues {
  name: string
  category: string
  files: any[]
  description: string
}

const initialChatFormValues: IChatFormValues = {
  name: '',
  category: '',
  files: [],
  description: '',
}

export const PlaygroundChats = () => {
  const chats = useSelector(getAllChats)
  const router = useRouter()
  const [chatSelected, setChatSelected] = useState<IChat>()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const currentUser = useSelector(getCurrentUser)
  const [files, setFiles] = useState<any[]>([])
  const [chatColor, setChatColor] = useState<string>('')
  const [chatFormValues, setChatFormValues] = useState<IChatFormValues>(initialChatFormValues)
  const [value, setValue] = useState(1)
  const [loading, setLoading] = useState(false)

  console.log('chats', chats)

  const subscribedChats = chats.filter(
    (chat) => chat.users.includes(currentUser._id) && chat.vizibility === 'public'
  )
  const myChats = chats.filter((chat) => chat.creator === currentUser._id)

  console.log('subscribedChats', subscribedChats)
  console.log('myChats', myChats)

  const uploadPdf = async () => {
    try {
      const formData = new FormData()

      // Assuming 'files' is an array of file objects
      files.forEach((fil) => {
        formData.append('pdfs', fil.originFileObj)
      })

      // Assuming 'currentUser._id' contains the user ID
      formData.append('userId', currentUser._id)

      const response = await axios.post('http://127.0.0.1:5000/extract', formData)

      console.log('PDF uploaded successfully:', response.data)

      if (response.status === 200) {
        setFiles([])
        return response.data.ok
      }
    } catch (error) {
      console.error('Error uploading PDF:', error)
    }
  }

  const handleCreateChat = async (e: FormEvent) => {
    e.preventDefault()

    const files2 = files.map((fil: any) => fil.originFileObj)

    const allFilesToBeUploaded = files2.map((fil: any) => {
      const obj = {
        name: fil.name,
        size: fil.size,
        type: fil.type,
        lastModified: fil.lastModified,
        lastModifiedDate: fil.lastModifiedDate,
      }
      return obj
    })

    const currentDate = new Date()
    const dateCreated = format(currentDate, 'dd-MM-yyyy')

    if (currentUser._id === undefined) {
      return
    }

    const test = {
      ...chatFormValues,
      vizibility: value === 1 ? 'public' : 'private',
      files: [],
      creator: currentUser._id,
      color: chatColor !== '' ? chatColor : '#919191',
      users: [],
      reviews: [],
      dateCreated: dateCreated,
    }

    setLoading(true)

    const ok = await uploadPdf()

    if (ok) {
      const newChat = await ChatFlow.createNewChat(test)

      if (newChat) {
        const success = await ChatFlow.deleteOldPdfs(currentUser._id)
        if (success) {
          setLoading(false)
          setChatFormValues(initialChatFormValues)
          setFiles([])
          setIsModalOpen(false)
        }
      }
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleFormCreateChatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target

    setChatFormValues({ ...chatFormValues, [name]: value })
  }

  const handleChangeCategory = (value: string) => {
    setChatFormValues({ ...chatFormValues, ['category']: value })
  }

  const onChange2 = (e: RadioChangeEvent) => {
    setValue(e.target.value)
  }

  const onChange = (info: any) => {
    const { status } = info.file

    if (status === 'uploading') {
      setFiles(info.fileList)
    }

    if (status !== 'uploading') {
      setFiles(info.fileList)
    }
    if (status === 'done') {
      // message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === 'error') {
      // message.error(`${info.file.name} file upload failed.`)
    }
  }

  const handleColorChange = (hex: string) => {
    setChatColor(hex)
  }

  const showModal = () => {
    setIsModalOpen(true)
  }

  const createDisabled =
    chatFormValues.category === '' ||
    files.length === 0 ||
    chatFormValues.name === '' ||
    chatColor === ''

  return (
    <Flex vertical gap={50}>
      <CollapsibleSection title="Personal chats">
        {myChats.length > 0 ? (
          <Flex style={{ padding: 20, overflowX: 'scroll' }} gap={30}>
            {myChats.length > 0 ? (
              myChats.map((chat) => <CustomChat key={chat._id} chat={chat} />)
            ) : (
              <span>No public chats created</span>
            )}
          </Flex>
        ) : (
          <Flex justify="center" style={{ width: '100%', padding: 20 }}>
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 100 }}
              description={<span>No existing chats</span>}
            >
              <Button onClick={showModal} type="primary">
                Create Now
              </Button>
            </Empty>
          </Flex>
        )}
      </CollapsibleSection>
      <CollapsibleSection title="Subscribed chats">
        {subscribedChats.length > 0 ? (
          <Flex style={{ padding: 20, overflowX: 'scroll' }} gap={30}>
            {subscribedChats.length > 0 ? (
              subscribedChats.map((chat) => <CustomChat key={chat._id} chat={chat} />)
            ) : (
              <span>No public chats created</span>
            )}
          </Flex>
        ) : (
          <Flex justify="center" style={{ width: '100%', padding: 20 }}>
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 100 }}
              description={<span>No existing chats</span>}
            >
              <Button onClick={showModal} type="primary">
                Create Now
              </Button>
            </Empty>
          </Flex>
        )}
      </CollapsibleSection>

      {/* <Flex vertical gap={20}>
        {chatSelected !== undefined ? (
          <Flex
            style={{ border: '1px solid #F1F0F0', borderRadius: 8, padding: 20 }}
            vertical
            gap={20}
          >
            <Flex gap={15} style={{ borderBottom: '1px solid #F1F0F0', paddingBottom: 10 }}>
              {' '}
              <InfoCircleOutlined style={{ fontSize: 25 }} />
              <span style={{ fontSize: 20 }}>Info</span>
            </Flex>
            <Flex gap={10} align="center">
              <span className="title">Name: </span>
              <span>{chatSelected.name}</span>
            </Flex>

            <Flex gap={10} align="center">
              <span className="title">Category: </span>
              <span>{chatSelected.category}</span>
            </Flex>

            <Flex gap={10} align="center">
              <span className="title">Vizibilty: </span>
              <span>
                {chatSelected.vizibility.charAt(0).toUpperCase() + chatSelected.vizibility.slice(1)}
              </span>
            </Flex>

            <Flex gap={10} align="center">
              <span className="title">Owner: </span>
              <span>
                <Link href={`/my-account/${UserFlow.userList[chatSelected.creator]._id}`}>
                  {UserFlow.userList[chatSelected.creator].name}
                </Link>
              </span>
            </Flex>

            <Flex gap={10} align="center">
              <span className="title">Created: </span>
              <span>{chatSelected.dateCreated}</span>
            </Flex>

            <Flex gap={10}>
              <span className="title">Description: </span>
              <span>{chatSelected.description}</span>
            </Flex>
          </Flex>
        ) : null}
      </Flex> */}

      <Modal
        style={{ height: 1000 }}
        width={900}
        title="Create Chat"
        open={isModalOpen}
        onOk={handleCreateChat}
        onCancel={() => {
          setChatFormValues(initialChatFormValues)
          setFiles([])
          handleCancel()
        }}
        okText={'Create'}
        cancelButtonProps={{ style: { backgroundColor: 'red', color: 'white', border: 'none' } }}
      >
        <div style={{ minHeight: 550 }}>
          {loading === false ? (
            <CreateChat
              handleCreateChat={handleCreateChat}
              handleFormCreateChatChange={handleFormCreateChatChange}
              handleChangeCategory={handleChangeCategory}
              chatFormValues={chatFormValues}
              onChange2={onChange2}
              value={value}
              handleColoChange={handleColorChange}
              onChange={onChange}
              createDisabled={createDisabled}
              setFiles={setFiles}
              files={files}
            />
          ) : (
            <Flex justify="center" align="center" style={{ width: '100%', height: 550 }}>
              <Spin size="large" />
            </Flex>
          )}
        </div>
      </Modal>
    </Flex>
  )
}
