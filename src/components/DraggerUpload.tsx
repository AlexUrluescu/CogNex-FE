import React, { useEffect, useState } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { Button, Flex, message, Upload } from 'antd'
import { useSelector } from 'react-redux'
import { getCurrentUser } from '@/state/appData/selectors'
import axios from 'axios'

const { Dragger } = Upload

interface IDraggerUpload {
  file: any
  setFile: any
  onChange: any
}

const DraggerUpload: React.FC<IDraggerUpload> = ({ file, setFile, onChange }) => {
  // useEffect(() => {
  //   console.log('file', file)
  // }, [file])

  const props: UploadProps = {
    name: 'file',
    multiple: true,
    // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',

    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files)
    },
  }

  const currentUser = useSelector(getCurrentUser)

  const uploadPdf = () => {
    const formData = new FormData()

    const test = file.map((fil: any) => fil.originFileObj)

    // console.log('file', test)

    // formData.append('pdf', file[0].originFileObj)
    // formData.append('pdf', test)
    file.forEach((fil: any) => {
      formData.append('pdfs', fil.originFileObj)
    })
    formData.append('userId', currentUser._id as string)

    axios
      .post('http://127.0.0.1:5000/extract', formData)
      .then((response) => {
        console.log('PDF uploaded successfully:', response.data)
        if (response.status === 200) {
          setFile([])
        }
      })
      .catch((error) => {
        console.error('Error uploading PDF:', error)
      })
  }

  return (
    <Flex vertical>
      <Dragger fileList={file} onChange={(e) => onChange(e)} {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or
          other banned files.
        </p>
      </Dragger>

      {/* <Button disabled={buttonDisabled} onClick={uploadPdf}>
        Sende
      </Button> */}
    </Flex>
  )
}

export default DraggerUpload
