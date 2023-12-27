import { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import ApiError from '../errors/ApiError'
import { Category, ICategory } from '../models/category'
import * as services from '../services/categoryService'

// get all categories
export const getAllCategories = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const limit = Number(request.query.limit) || 0
    const page = Number(request.query.page) || 1
    const search = (request.query.search as string) || ''

    const { allCategoriesOnPage, totalPage, currentPage } = await services.findAllCategories(
      page,
      limit,
      search
    )

    response.status(200).json({
      message: `All categories are returned `,
      payload: {
        allCategoriesOnPage,
        totalPage,
        currentPage,
      },
    })
  } catch (error) {
    next(error)
  }
}

// get a specific category
export const getSingleCategory = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params

    const category = await services.findCategoryById(id, next)

    response.status(200).json({
      message: `Single category is returned `,
      payload: category,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

// delete a specific category
export const deleteCategory = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params

    const category = await services.findAndDeletedCategory(id, next)

    response.status(200).json({
      message: `Category with ID: ${id} is deleted`,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}

// create a new category
export const createCategory = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const newInput = request.body

    const category = await services.findIfCategoryExist(newInput, next)

    const newCategory: ICategory = new Category({
      name: newInput.name,
    })
    const savedCategory = await newCategory.save()

    response.status(201).json({
      message: `New category is created`,
      payload: savedCategory,
    })
  } catch (error) {
    next(error)
  }
}

// update a specific category
export const updateCategory = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const updatedCategory = request.body

    const isCategoryExist = await services.findIfCategoryExist(updatedCategory, next)

    const category = await services.findAndUpdateCategory(id, next, updatedCategory)

    response.status(200).json({
      message: `Category with ID: ${id} is updated`,
      payload: category,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}
