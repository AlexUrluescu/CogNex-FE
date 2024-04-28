import React from 'react'
import { Flex, ColorPicker, Input } from 'antd'
import DraggerUpload from './DraggerUpload'
import { Radio } from 'antd'

const { TextArea } = Input

export const CreateChat = ({
  handleCreateChat,
  handleFormCreateChatChange,
  chatFormValues,
  onChange2,
  value,
  handleColoChange,
  onChange,
  setFiles,
  files,
}: any) => {
  return (
    <div>
      <Flex style={{ marginTop: 30 }} gap={15} vertical>
        <form onSubmit={handleCreateChat}>
          <Flex vertical gap={20}>
            <Flex align="center" gap={10}>
              <span style={{ fontSize: 18, width: '13%' }}>Name</span>
              <Input
                style={{ width: 200 }}
                onChange={handleFormCreateChatChange}
                name="name"
                value={chatFormValues.name}
                placeholder="Name"
              />
            </Flex>
            <Flex align="center" gap={10}>
              <span style={{ fontSize: 18, width: '13%' }}>Category</span>

              <Input
                style={{ width: 200 }}
                onChange={handleFormCreateChatChange}
                name="category"
                value={chatFormValues.category}
                placeholder="Category"
              />
            </Flex>
            <Flex align="start" gap={10}>
              <span style={{ fontSize: 18, width: '13%' }}>Description</span>
              <TextArea
                style={{ width: 400, height: 100 }}
                onChange={handleFormCreateChatChange}
                name="description"
                placeholder="Description"
                value={chatFormValues.description}
              />
            </Flex>
            <Flex align="center" gap={10}>
              <span style={{ fontSize: 18, width: '13%' }}>Vizibility</span>

              <Radio.Group onChange={onChange2} value={value}>
                <Radio value={1}>Public</Radio>
                <Radio value={2}>Private</Radio>
              </Radio.Group>
              {value === 1 ? (
                <span
                  style={{
                    color: 'red',
                    border: '1px solid red',
                    padding: 5,
                    borderRadius: 10,
                    fontSize: 12,
                    backgroundColor: '#facfd2',
                  }}
                >
                  All the users will be able to see and use your chat
                </span>
              ) : null}
            </Flex>

            <Flex>
              <span style={{ fontSize: 18, width: '13%' }}>Color</span>
              <ColorPicker
                onChange={(color_, hex) => handleColoChange(hex)}
                defaultValue="#1677ff"
                showText
              />
            </Flex>
            {/* <input onChange={handleChangeFile} name="file" type="file" accept=".pdf" />
          <UploadFile onChange={handleFormCreateChatChange} name="file" setFile={setFile} /> */}

            <DraggerUpload setFile={setFiles} file={files} onChange={onChange} />
          </Flex>
        </form>
      </Flex>
    </div>
  )
}
