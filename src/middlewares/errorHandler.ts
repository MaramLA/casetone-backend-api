import { NextFunction, Request, Response } from 'express'

import ApiError from '../errors/ApiError'
import { Error } from '../types'

const apiErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.code).json({ msg: err.message })
    return
  }

  res.status(500).json({ msg: err.message })
}

export default apiErrorHandler
