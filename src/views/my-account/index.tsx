import { IUser2 } from '@/domain/user'
import React from 'react'

interface IMyAccountView {
  user: IUser2
}

export const MyAccountView: React.FC<IMyAccountView> = ({ user }) => {
  console.log('user', user)

  return <div>MyAccountView</div>
}
