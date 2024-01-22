import { Response } from 'express'

// initialize cookies
const setCookieResponse = (response: Response, accessToken: string) => {
  response.cookie('access_token', accessToken, {
    maxAge: 4 * 60 * 60 * 1000,
    path: '/',
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })
}

export default setCookieResponse
