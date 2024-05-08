import { v4 } from 'uuid'
import { IUser } from '../user'

export const defaultTeleportValues = {
  _id: '',
  creator: '',
  name: '',
  category: '',
  chats: [],
  teleportUser: '',
  color: '',
  dateCreated: '',
  description: '',
}

export interface ITeleport {
  _id?: string
  creator: string
  name: string
  category: string
  chats: string[]
  teleportUser: string
  color: string
  dateCreated: string
  description: string
}

export interface ITeleport2 {
  _id: string
  creator: string
  name: string
  category: string
  chats: string[]
  teleportUser: string
  color: string
  dateCreated: string
  description: string
}

export class Teleport implements ITeleport {
  _id: string
  creator: string
  name: string
  category: string
  chats: string[]
  teleportUser: string
  color: string
  dateCreated: string
  description: string

  constructor(teleport: ITeleport) {
    this._id = teleport._id || v4()
    this.creator = teleport.creator
    this.name = teleport.name
    this.category = teleport.category
    this.chats = teleport.chats
    this.teleportUser = teleport.teleportUser
    this.color = teleport.color
    this.dateCreated = teleport.dateCreated
    this.description = teleport.description
  }

  toJSON = () => {
    return {
      _id: this._id,
      creator: this.creator,
      name: this.name,
      category: this.category,
      chats: this.chats,
      teleportUser: this.teleportUser,
      dateCreated: this.dateCreated,
      description: this.description,
    }
  }
}
