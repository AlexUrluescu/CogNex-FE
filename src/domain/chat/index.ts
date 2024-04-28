import { v4 } from 'uuid'
import { IUser } from '../user'

interface IUserReview {
  rate: number
  message: string
  userId: string
  date: string
}

export const defaultChatValues = {
  _id: '',
  creator: '',
  name: '',
  category: '',
  files: [],
  vizibility: '',
  users: [],
  reviews: [],
  color: '',
  dateCreated: '',
  description: '',
}

export interface IChat {
  _id?: string
  creator: string
  name: string
  category: string
  files: any[]
  vizibility: string
  users: string[]
  color: string
  dateCreated: string
  description: string
  reviews?: IUserReview[]
}

export class Chat implements IChat {
  _id: string
  creator: string
  name: string
  category: string
  files: any[]
  vizibility: string
  users: string[]
  reviews: IUserReview[]
  color: string
  dateCreated: string
  description: string

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
    this.dateCreated = chat.dateCreated
    this.description = chat.description
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
      dateCreated: this.dateCreated,
      description: this.description,
    }
  }
}
