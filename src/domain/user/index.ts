import { v4 } from 'uuid'

export interface IUser {
  _id?: string
  firstName: string
  lastName: string
  email: string
  age: string
  password: string
  files?: string[]
}

export interface IUser2 {
  _id: string
  firstName: string
  lastName: string
  email: string
  age: string
  password: string
  files?: string[]
}

export class User implements IUser {
  _id: string
  firstName: string
  lastName: string
  email: string
  age: string
  password: string
  files?: string[] | undefined

  constructor(user: IUser) {
    this._id = user._id || v4()
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.email = user.email
    this.age = user.age
    this.password = user.password
    this.files = user.files || []
  }

  toJSON = () => {
    return {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      age: this.age,
      password: this.password,
      files: this.files,
    }
  }
}
