import { v4 } from 'uuid'

export interface IUser {
  _id: string
  name: string
  email: string
  age: string
  photo: string
  description: string
  ocupation: string
  country: string
  files?: string[]
}

export interface IUser2 {
  _id: string
  name: string
  email: string
  age: string
  photo: string
  description: string
  ocupation: string
  country: string
  files?: string[]
}

export class User implements IUser {
  _id: string
  name: string
  email: string
  age: string
  photo: string
  description: string
  ocupation: string
  country: string
  files?: string[] | undefined

  constructor(user: IUser) {
    this._id = user._id || v4()
    this.name = user.name
    this.email = user.email
    this.age = user.age
    this.photo = user.photo
    this.description = user.description
    this.ocupation = user.ocupation
    this.country = user.country
    this.files = user.files || []
  }

  toJSON = () => {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      age: this.age,
      photo: this.photo,
      description: this.description,
      ocupation: this.ocupation,
      country: this.country,
      files: this.files,
    }
  }
}
