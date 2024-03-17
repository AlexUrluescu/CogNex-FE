import { v4 } from 'uuid'
import { IUser } from '../user'

export interface IChat {
  _id?: string
  creator: string
  name: string
  category: string
  files: any[]
  vizibility: string
  users?: IUser[]
  reviews?: any[]
  color: string
}

export class Chat implements IChat {
  _id: string
  creator: string
  name: string
  category: string
  files: any[]
  vizibility: string
  users: IUser[]
  reviews: any[]
  color: string

  constructor(chat: IChat) {
    this._id = chat._id || v4()
    this.creator = chat.creator
    this.name = chat.name
    this.category = chat.category
    this.files = chat.files
    this.vizibility = chat.vizibility
    this.users = chat.users || []
    this.reviews = chat.reviews || []
    this.color = chat.color
  }

  toJSON = () => {
    return {
      _id: this._id,
      creator: this.creator,
      name: this.name,
      category: this.category,
      files: this.files,
      vizibilty: this.vizibility,
      users: this.users,
      reviews: this.reviews,
    }
  }
}
