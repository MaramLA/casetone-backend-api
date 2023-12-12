import jwt from 'jsonwebtoken'
import ApiError from '../errors/ApiError'

// generate a token using JWT
export const generateToken = (payload: object, jwtSecret: string, expiresIn = '10m') => {
  if (!jwtSecret || jwtSecret == '') {
    throw ApiError.badRequest(400, 'jwt Secret key must be provided')
  }

  if (!Object.keys(payload).length) {
    throw ApiError.badRequest(400, 'payload can not be empty')
  }

  return jwt.sign(payload, jwtSecret, {
    expiresIn: expiresIn,
  })
}

// verify the generate token
export const verifyToken = (token: string, jwtSecret: string) => {
  if (!jwtSecret || jwtSecret == '') {
    throw ApiError.badRequest(400, 'jwt Secret key must be provided')
  }

  if (!token) {
    throw ApiError.badRequest(400, 'Token must be provided')
  }

  const decoded = jwt.verify(token, jwtSecret)

  if (!decoded) {
    throw ApiError.badRequest(401, 'Invalid access token')
  }

  return decoded
}
