import { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'

export const runValidation = (request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request)
  if (!errors.isEmpty()) {
    let errorsList = errors.array().map((error) => error.msg)
    return response.status(400).json({ errors: errorsList })
  }

  next()
}
