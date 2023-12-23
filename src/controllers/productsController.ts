import { NextFunction, Request, Response } from 'express'
import fs from 'fs/promises'
import mongoose from 'mongoose'

// import cloudinaryService from '../config/cloudinary'
import ApiError from '../errors/ApiError'
import { IProduct, Product } from '../models/product'
import * as services from '../services/productService'

import { v2 as cloudinary } from 'cloudinary'
import { dev } from '../config'
import { User } from '../models/user'

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
    let imagePath = request.file && request.file?.path

    const productExist = await services.findIfProductExist(newInput, next)

    const newProduct: IProduct = new Product({
      name: newInput.name,
      price: Number(newInput.price),
      quantity: Number(newInput.quantity),
      sold: Number(newInput.sold),
      description: newInput.description,
      categories: newInput.categories,
      sizes: newInput.sizes,
      variants: newInput.variants,
    })

    if (imagePath) {
      const cloudinaryResponse = await cloudinary.uploader.upload(
        imagePath,
        { folder: 'sda-ecommerce' },
        function (result) {
          console.log(result)
        }
      )
      newProduct.image = cloudinaryResponse.secure_url
    } else if (!imagePath) {
      next(ApiError.badRequest(400, `Provide an image please`))
    }
    // if (newProduct.image) {
    //   const cloudinaryResponse = await cloudinary.uploader.upload(
    //     newProduct.image,
    //     { folder: 'sda-ecommerce' },
    //     function (result) {
    //       console.log(result)
    //     }
    //   )
    //   newProduct.image = cloudinaryResponse.secure_url
    // }
    console.log('newProduct.image ' + newProduct.image)

    if (newProduct) {
      const createdProduct = await newProduct.save()
      response.status(201).json({
        message: `Created a new product`,
        createdProduct,
      })
    } else {
      next(ApiError.badRequest(400, `Invalid document`))
    }
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
    const newImage = request.file && request.file?.path

    const foundProduct = await Product.findById(id)
    if (!foundProduct) {
      throw ApiError.badRequest(404, `Product is not found with this id: ${id}`)
    }
    let originalImage = foundProduct && foundProduct.image

    if (newImage) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(
          newImage,
          {
            folder: 'sda-ecommerce',
          },
          function (result) {
            console.log(result)
          }
        )

        if (cloudinaryResponse && cloudinaryResponse.secure_url) {
          updatedProduct.image = cloudinaryResponse.secure_url
          console.log('Image updated in Cloudinary:', updatedProduct.image)
        } else {
          throw ApiError.badRequest(
            400,
            'Failed to update image in Cloudinary. Secure URL not found.'
          )
        }

        const parts = originalImage && originalImage.split('/')
        const publicId = parts && `sda-ecommerce/` + parts[parts.length - 1].split('.')[0] // Assumes last segment is public ID
        console.log('publicId-update: ', publicId)
        const deletionResult = publicId && (await cloudinary.uploader.destroy(publicId))
        if (deletionResult.result === 'ok') {
          console.log('Image deleted from Cloudinary')
        } else {
          throw ApiError.badRequest(400, 'Failed to delete image from Cloudinary')
        }
      } catch (error) {
        next(error)
      }
    }

    // if (newImage) {
    //   const cloudinaryResponse = await cloudinary.uploader.upload(
    //     newImage,
    //     { folder: 'sda-ecommerce' },
    //     function (result, error) {
    //       if (error) {
    //         console.log('hey errorrrr: ', error)
    //       } else {
    //         console.log(result)
    //       }
    //     }
    //   )
    //   if (cloudinaryResponse.result === 'ok') {
    //     updatedProduct.image = cloudinaryResponse.secure_url
    //     console.log('updatedProduct.image1: ', updatedProduct.image)
    //     console.log('Image updated in Cloudinary')
    //     const parts = originalImage && originalImage.split('/')
    //     const publicId = parts && `sda-ecommerce/` + parts[parts.length - 1].split('.')[0] // Assumes last segment is public ID
    //     console.log('publicId-update: ', publicId)
    //     const deletionResult = publicId && (await cloudinary.uploader.destroy(publicId))
    //     if (deletionResult.result === 'ok') {
    //       console.log('Image deleted from Cloudinary')
    //     } else {
    //       console.error('Failed to delete image from Cloudinary')
    //     }
    //   } else {
    //     console.error('Failed to update image in Cloudinary')
    //   }
    //   console.log('updatedProduct.image1: ', updatedProduct.image)
    // }
    console.log('updatedProduct.image2: ', updatedProduct.image)

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
