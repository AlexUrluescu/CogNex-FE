import React from 'react'
import { Flex, ColorPicker, Input, Select } from 'antd'
import DraggerUpload from './DraggerUpload'
import { Radio } from 'antd'
import { categoryOptions } from '@/utils'

const { TextArea } = Input

export const CreateChat = ({
  handleCreateChat,
  handleFormCreateChatChange,
  handleChangeCategory,
  chatFormValues,
  onChange2,
  value,
  handleColoChange,
  onChange,
  setFiles,
  files,
}: any) => {
  const onSearch = (value: string) => {
    console.log('search:', value)
  }
  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

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

              <Select
                style={{ width: 200 }}
                value={chatFormValues.category}
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
