import { NextFunction, Request, Response } from 'express'
import fs from 'fs/promises'
import mongoose from 'mongoose'

// import cloudinaryService from '../config/cloudinary'
import ApiError from '../errors/ApiError'
import { IProduct, Product } from '../models/product'
import * as services from '../services/productService'

import { v2 as cloudinary } from 'cloudinary'
import { dev } from '../config'

const cloudinaryService = cloudinary.config({
  cloud_name: dev.cloud.cloudinaryName,
  api_key: dev.cloud.cloudinaryAPIKey,
  api_secret: dev.cloud.cloudinaryAPISecretKey,
})

// get all products
export const getAllProducts = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const products = await services.findAllProducts(request)

    response.status(200).json({
      message: `Return all products `,
      payload: {
        products,
      },
    })
  } catch (error) {
    next(error)
  }
}
// get a specific product
export const getSingleProduct = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { id } = request.params

    const singleProduct = await services.findProductById(id)

    response.status(200).json({
      message: `Return a single product `,
      payload: singleProduct,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(ApiError.badRequest(400, `ID format is Invalid must be 24 characters`))
    } else {
      next(error)
    }
  }
}
// delete a specific product
export const deleteProduct = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const foldername = 'sda-ecommerce'

    const deletedProduct = await services.findAndDeletedProduct(id, next).then(async (data) => {
      if (data) {
        const parts = data.image.split('/')
        const publicId = `${foldername}/` + parts[parts.length - 1].split('.')[0] // Assumes last segment is public ID
        console.log('publicId111: ', publicId)
        const deletionResult = await cloudinary.uploader.destroy(publicId)
        if (deletionResult.result === 'ok') {
          console.log('Image deleted from Cloudinary')
          response.status(200).json({
            message: `Delete a single product with ID: ${id}`,
          })
        } else {
          console.error('Failed to delete image from Cloudinary')
        }
      }
    })
    // if (deletedProduct) {
    //   const parts = deletedProduct.image.split('/')
    //   const publicId = `${foldername}/` + parts[parts.length - 1].split('.')[0] // Assumes last segment is public ID
    //   console.log('publicId111: ', publicId)
    //   const deletionResult = await cloudinary.uploader.destroy(publicId)
    //   if (deletionResult.result === 'ok') {
    //     console.log('Image deleted from Cloudinary')
    //   } else {
    //     console.error('Failed to delete image from Cloudinary')
    //   }
    // }
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      if (error.path === '_id' && error.kind === 'ObjectId') {
        next(
          ApiError.badRequest(
            400,
            `Invalid ID format: ID format is Invalid must be 24 characters on schema  feild : ${error.path} : ${error.message}`
          )
        )
      } else {
        next(ApiError.badRequest(400, `Invalid data format. Please check your input`))
      }
    } else {
      next(error)
    }
  }
}
// create a new product
export const createProduct = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const newInput = request.body
    let imagePath = request.file?.path
    console.log('imagePath ' + imagePath)

    const productExist = await services.findIfProductExist(newInput, next)

    const newProduct: IProduct = new Product({
      name: newInput.name,
      price: newInput.price,
      quantity: newInput.quantity,
      sold: newInput.sold,
      description: newInput.description,
      categories: newInput.categories,
      sizes: newInput.sizes,
      variants: newInput.variants,
    })

    if (imagePath) {
      newProduct.image = imagePath
      console.log('Add Image')
    } else if (!imagePath) {
      next(ApiError.badRequest(400, `Provide an image please`))
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
      newProduct.image,
      { folder: 'sda-ecommerce' },
      function (error, result) {
        console.log(result)
      }
    )
    newProduct.image = cloudinaryResponse.secure_url

    if (newProduct) {
      await newProduct.save()
    } else {
      next(ApiError.badRequest(400, `Invalid document`))
    }

    response.status(201).json({
      message: `Create a single product`,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw ApiError.badRequest(
        400,
        `Invalid ID format: ID format is Invalid must be 24 characters`
      )
    } else {
      next(error)
    }
  }
}
// update a specific product
export const updateProduct = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { id } = request.params
    const updatedProduct = request.body
    const newImage = request.file?.path

    let imgUrl = ''
    if (request.file?.path) {
      imgUrl = `${newImage}`
      updatedProduct.image = imgUrl

      //check product have image
      const productInfo = await Product.findById(id)
      const productImage = productInfo?.image

      if (productImage) {
        try {
          fs.unlink(productImage)
        } catch (error) {
          throw ApiError.badRequest(400, `Error deleting file:${error}`)
        }
      } else if (!productImage) {
        next()
      }
    }
    const productUpdated = await services.findAndUpdateProduct(id, request, next, updatedProduct)

    response.status(200).json({
      message: `Update a single product`,
      payload: productUpdated,
    })
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      throw ApiError.badRequest(400, `ID format is Invalid must be 24 characters`)
    } else {
      next(error)
    }
  }
}
