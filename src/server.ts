import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express, { Application, NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import authRouter from './routers/authRouter'
import categoriesRouter from './routers/categoriesRouter'
import ordersRouter from './routers/ordersRouter'
import productsRouter from './routers/productRouter'
import usersRouter from './routers/usersRouter'

import ApiError from './errors/ApiError'
import apiErrorHandler from './middlewares/errorHandler'
import myLogger from './middlewares/logger'

config()
const app: Application = express()
const PORT = 5050

mongoose.set('strictQuery', false)
mongoose.set('strictPopulate', false)
const URL = process.env.ATLAS_URL || 'mongodb://127.0.0.1:27017/full-stack-demo-db'

app.use(myLogger)
app.use(cors)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('imageUser'))

app.use('/products', productsRouter)
app.use('/categories', categoriesRouter)
app.use('/orders', ordersRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)

app.get('/', (request: Request, response: Response) => {
  response.json({
    message: 'CheckUp The Server',
  })
})

app.use((request: Request, response: Response, next: NextFunction) => {
  next(ApiError.badRequest(404, `Router not Found`))
})

app.use(apiErrorHandler)

mongoose
  .connect(URL)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log(`MongoDB connection error: ${err}`)
  })

app.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`)
})
