import bycrypt from 'bcrypt'

import ApiError from '../errors/ApiError'
import { IUser, User } from '../models/user'

//check entered email match to email on DB
export const isEmailMatch = async (inputEmail: string): Promise<IUser> => {
  const user = await User.findOne({ email: inputEmail })

  if (!user) {
    throw ApiError.badRequest(404, 'Their is no match with this email address')
  }
  return user
}

//check entered password match to password on DB
export const isPasswordMatch = async (user: IUser, password: string) => {
  const passwordCompare = await bycrypt.compare(password, user.password)
  if (!passwordCompare) {
    throw ApiError.badRequest(401, 'The password does not match')
  }
}

//check entered user is blocked or not
export const isUserBanned = (user: IUser) => {
  if (user.isBanned) {
    throw ApiError.badRequest(403, 'This user was banned please connect to support@casetone.com')
  }
}
