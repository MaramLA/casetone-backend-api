import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import ApiError from '../errors/ApiError'
import * as services from '../services/orderService'

interface CustomeRequest extends Request {
  userId?: string
}

// get all orders for admin
export const getOrdersForAdmin = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const limit = Number(request.query.limit) || 0
    const page = Number(request.query.page) || 1

    // return all orders with pagenation feature
    const allOrdersOnPage = await services.findAllOrdersForAdmin(page, limit, next)

    response.status(200).send({
      message: `Return all orders for the admin`,
      payload: allOrdersOnPage,
    })
  } catch (error) {
    next(error)
  }
}

// get all orders of a specific user
export const getOrdersForUser = async (
  request: CustomeRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    const userOrders = await services.findUserOrders(request, next)
    if (userOrders?.length === 0) {
      throw ApiError.badRequest(400, 'Process ended unsuccussfully')
    }
    response.status(200).send({
      message: 'Orders are returend',
      payload: userOrders,
    })
  } catch (error) {
    next(error)
  }
}

// delete a specific order
export const deleteOrder = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    await services.findAndDeleteOrder(id, next)

    response.status(204).send({
      message: `Deleted order with id ${id}`,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, 'Id format is not valid and must be 24 characters'))
    }
    next(error)
  }
}

// delete all user orders
export const deleteAllUserOrders = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params

    await services.findAndDeleteAllUserOrders(id, next)

    response.status(204).send({
      message: `Deleted all user orders successfully`,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, 'Id format is not valid and must be 24 characters'))
    }
    next(error)
  }
}

// update a specific order
export const updateOrder = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const updatedOrderStatus = request.body.status as String

    if (!updatedOrderStatus) {
      throw ApiError.badRequest(400, `Provide order status`)
    }

    const updatedOrder = await services.findAndUpdateOrder(id, response, updatedOrderStatus, next)
    if (updatedOrder) {
      response.status(200).send({
        message: `Updated order status succussfully`,
        payload: updatedOrder,
      })
    }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}
