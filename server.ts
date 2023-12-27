import cookieParser from 'cookie-parser'
import cors from 'cors'
import { config } from 'dotenv'
import express, { Application, NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'

import authRouter from './src/routers/authRouter'
import categoriesRouter from './src/routers/categoriesRouter'
import ordersRouter from './src/routers/ordersRouter'
import productsRouter from './src/routers/productsRouter'
import usersRouter from './src/routers/usersRouter'

import { dev } from './src/config'
import ApiError from './src/errors/ApiError'
import apiErrorHandler from './src/middlewares/errorHandler'
import myLogger from './src/middlewares/logger'

config()
const app: Application = express()
const port = dev.app.port

mongoose.set('strictQuery', false)
mongoose.set('strictPopulate', false)
const databaseUrl = dev.db.url

app.use(myLogger)
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static('public'))

app.use('/categories', categoriesRouter)
app.use('/products', productsRouter)
app.use('/orders', ordersRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)

app.get('/', (request: Request, response: Response) => {
  response.json({
    message: 'The server is running fine',
  })
})

app.use((request: Request, response: Response, next: NextFunction) => {
  next(ApiError.badRequest(404, `Router not Found`))
})

app.use(apiErrorHandler)

mongoose
  .connect(databaseUrl)
  .then(() => {
    console.log('Database connected')
  })
  .catch((err) => {
    console.log(`MongoDB connection error: ${err}`)
  })

app.listen(port, () => {
  console.log(`Server running http://localhost:${port}`)
})
