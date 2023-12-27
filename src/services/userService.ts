import { JwtPayload } from 'jsonwebtoken'
import mongoose, { SortOrder } from 'mongoose'

import ApiError from '../errors/ApiError'
import { IUser, User } from '../models/user'
import { UsersPaginationType } from '../types'
import { Order } from '../models/order'

// return all Users using pagination
export const findAllUsers = async (
  page: number,
  limit: number,
  search: string,
  sort: SortOrder,
  isAdmin: string,
  isBanned: string
): Promise<UsersPaginationType> => {
  const searchRegularExpression = new RegExp('.*' + search + '.*', 'i')
  const searchFilter = {
    $or: [
      { firstName: { $regex: searchRegularExpression } },
      { lastName: { $regex: searchRegularExpression } },
      { email: { $regex: searchRegularExpression } },
    ],
  }

  // isAdmin and isBanned values must be boolean
  const roleFilter = isAdmin ? { isAdmin: isAdmin } : {}
  const bannedUsersFilter = isBanned ? { isBanned: isBanned } : {}

  const filters = { $and: [roleFilter, bannedUsersFilter, searchFilter] }
  const countPage = await User.countDocuments()
  const totalPage = limit ? Math.ceil(countPage / limit) : 1
  if (page > totalPage) {
    page = totalPage
  }
  const skip = (page - 1) * limit

  const allUsers = await User.find(filters, {
    password: 0,
  })
    .skip(skip)
    .limit(limit)
    .sort({ firstName: sort, lastName: sort })

  return {
    allUsers,
    totalPage,
    currentPage: page,
  }
}

// find order by user id
export const findSingleUser = async (filter: object): Promise<IUser> => {
  const user = await User.findOne(filter, {
    password: 0,
  })

  if (!user) {
    throw ApiError.badRequest(404, `User was not found`)
  }
  return user
}

//throw error if entered user email is already used by other users on DB
export const findIfUserEmailExist = async (inputEmail: string, inputId: string | null = null) => {
  const user = await User.exists({ $and: [{ _id: { $ne: inputId } }, { email: inputEmail }] })

  if (user) {
    throw ApiError.badRequest(409, 'This email is already exists')
  }
}

// create new user
export const createUser = async (newUser: JwtPayload): Promise<IUser> => {
  const user = new User(newUser)
  await user.save()
  return user
}

// find and update user by id
export const findUserAndUpdate = async (
  filter: object,
  inputUser: IUser | object
): Promise<IUser> => {
  const user = await User.findOneAndUpdate(filter, inputUser, { new: true })
  if (!user) {
    throw ApiError.badRequest(404, 'User was Not Found')
  }
  return user
}

//update role user to admin or user by id user
export const updateUserRoleById = async (id: string, isAdmin: boolean): Promise<IUser> => {
  const update = { isAdmin: isAdmin }
  if (isAdmin === true) {
    const foundUserOrders = await Order.findOne({ user: id })
    if (foundUserOrders) {
      throw ApiError.badRequest(403, 'This user does not meet the promotion condition')
    }
  }
  const user = await User.findByIdAndUpdate(id, update, { new: true })
  if (!user) {
    throw ApiError.badRequest(404, 'User was not found')
  }

  return user
}

//update status of user to block or unblock by id user
export const updateBanStatusById = async (id: string, isBanned: boolean): Promise<IUser> => {
  const update = { isBanned: isBanned }
  const user = await User.findByIdAndUpdate(id, update, { new: true })

  if (!user) {
    throw ApiError.badRequest(404, 'User was not found')
  }

  return user
}

// find and delete user by id
export const findAndDeleteUser = async (id: string) => {
  // Find all orders associated with the user
  const userOrders = await Order.find({ user: id })

  if (userOrders) {
    // Delete each order associated with the user
    await Promise.all(
      userOrders.map(async (order) => {
        await order.remove()
      })
    )
  }

  // After deleting orders, delete the user
  const user = await User.findByIdAndDelete(id)

  if (!user) {
    throw ApiError.badRequest(404, `User with ${id} was not found`)
  }
}
