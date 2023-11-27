import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

import { dev } from '../config'
import ApiError from '../errors/ApiError'
import * as services from '../services/userService'

const getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const limit = Number(request.query.limit)
    const page = Number(request.query.page)

    if (limit || page) {
      const { allUsersOnPage, totalPage, currentPage } = await services.findAllUsersOnPage(
        page,
        limit
      )

      return response.json({ message: 'users were found', allUsersOnPage, totalPage, currentPage })
    } else {
      const { allUsers } = await services.findAllUsers()
      return response.json({ message: 'Users were found', allUsers })
    }
  } catch (error) {
    next(error)
  }
}

const getSingleUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const user = await services.findUserByID(id)
    response.json({ message: 'User was found', user })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, 'Id format is not valid'))
    } else {
      next(error)
    }
  }
}

const registUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { email } = request.body
    const userExists = await services.isUserEmailExists(email)

    const token = jwt.sign(request.body, dev.app.jwsUserActivationKey, { expiresIn: '1m' })
    services.sendTokenByEmail(email, token)

    response.json({ message: 'Check your email to activate the account ', token })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

const activateUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { token } = request.body
    const user = await services.checkTokenAndActivate(token)

    response.status(201).json({ message: 'User was activated ', user })
  } catch (error) {
    next(error)
  }
}

const updateUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const { email } = request.body
    const updatedUser = request.body

    const userExists = await services.isUserEmailExists(email, id)

    const user = await services.findUserAndUpdate(id, updatedUser)

    response.json({ message: 'User was updated', user })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

const deleteUser = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const user = await services.findUserAndDelete(id)

    response.json({ message: 'User was deleted', user })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, 'Id format is not valid'))
    } else {
      next(error)
    }
  }
}

// search users
const searchUsers = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { firstName } = request.params

    // search users by name
    const searchResult = await services.searchUsersByName(firstName, next)

    response.status(200).send({
      message: `Results found`,
      payload: searchResult,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

export { getAllUsers, getSingleUser, registUser, activateUser, updateUser, deleteUser, searchUsers }
