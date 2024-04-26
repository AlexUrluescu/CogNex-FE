// import DraggerUpload from '@/components/DraggerUpload'
// import { RegisterFlow } from '@/flows/register'
// import { Button } from 'antd'
// import axios from 'axios'
// import { useRouter } from 'next/router'
// import React, { useState } from 'react'

// type ICcontentRegisterForm = {
//   firstName: string
//   lastName: string
//   email: string
//   age: string
//   password: string
// }

// const initialContentRegisterForm = {
//   firstName: '',
//   lastName: '',
//   email: '',
//   age: '',
//   password: '',
// }

// const url = process.env.NEXT_PUBLIC_ROUTE

// const Register = () => {
//   const [contentRegisterForm, setContentRegisterForm] = useState<ICcontentRegisterForm>(
//     initialContentRegisterForm
//   )
//   const [files, setFiles] = useState<any>()

//   const router = useRouter()

//   const handleRegisterFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target

//     setContentRegisterForm({ ...contentRegisterForm, [name]: value })
//   }

//   const handleRegisterFormSubmit = async (e: any) => {
//     e.preventDefault()

//     const newUser = await RegisterFlow.registerNewUser(contentRegisterForm)

//     if (newUser !== undefined) {
//       router.push('/login')
//       setContentRegisterForm(initialContentRegisterForm)
//     }
//   }

//   const onChange = (info: any) => {
//     const { status } = info.file
//     console.log('intra in change')

//     if (status === 'uploading') {
//       console.log('uploading')
//       setFiles(info.fileList)
//     }

//     if (status !== 'uploading') {
//       console.log(info.fileList)
//       setFiles(info.fileList)
//     }
//     if (status === 'done') {
//       // message.success(`${info.file.name} file uploaded successfully.`)
//     } else if (status === 'error') {
//       // message.error(`${info.file.name} file upload failed.`)
//     }
//   }

//   const handleClick = () => {
//     if (files === undefined) {
//       return
//     }
//     const formData = new FormData()

//     Object.values(files).forEach((file: any) => {
//       formData.append('images', file)
//     })

//     axios
//       .post(`http://127.0.0.1:5000/upload-photo`, formData)
//       .then((response) => {
//         // setImagesWithData(response.data.data);
//         setFiles([])
//         console.log(response)

//         // const customMessage = `${response.data.data.length} images were uploaded successfully`
//       })

//       .catch((error) => {
//         console.error('Error uploading PDF:', error)
//         const customMessage = `was not possible to uploaded images`
//       })
//   }

//   const uploadPdf = () => {
//     const formData = new FormData()

//     formData.append('file', files)

//     console.log('formData', formData)

//     axios
//       .post('http://127.0.0.1:5000/upload-photo', formData)
//       .then((response) => {
//         console.log('PDF uploaded successfully:', response.data)
//         if (response.status === 200) {
//           setFiles([])
//         }
//       })
//       .catch((error) => {
//         console.error('Error uploading PDF:', error)
//       })
//   }

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleRegisterFormSubmit}>
//         <input
//           onChange={handleRegisterFormChange}
//           name="firstName"
//           placeholder="firstName"
//           value={contentRegisterForm.firstName}
//         />
//         <input
//           onChange={handleRegisterFormChange}
//           name="lastName"
//           placeholder="lastName"
//           value={contentRegisterForm.lastName}
//         />
//         <input
//           onChange={handleRegisterFormChange}
//           name="email"
//           placeholder="email"
//           value={contentRegisterForm.email}
//         />
//         <input
//           onChange={handleRegisterFormChange}
//           type="number"
//           name="age"
//           placeholder="age"
//           value={contentRegisterForm.age}
//         />

//         <input
//           onChange={handleRegisterFormChange}
//           type="password"
//           name="password"
//           placeholder="password"
//           value={contentRegisterForm.password}
//         />

//         <button type="submit">Register</button>
//       </form>
//       hei
//       {/* <DraggerUpload setFile={setFiles} file={files} onChange={onChange} /> */}
//       <input
//         className="cursor-pointer"
//         type="file"
//         multiple
//         onChange={(e) => setFiles(e.target.files)}
//       />
//       <Button type="primary" onClick={handleClick}>
//         upload photo
//       </Button>
//     </div>
//   )
// }

// export default Register
