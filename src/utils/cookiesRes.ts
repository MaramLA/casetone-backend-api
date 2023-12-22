import { Response } from 'express'

// initialize cookies
const setCookieResponse = (response: Response, accessToken: string) => {
  response.cookie('access_token', accessToken, {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  })
}

export default setCookieResponse
