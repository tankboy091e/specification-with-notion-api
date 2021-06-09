/* eslint-disable no-restricted-syntax */
import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler,
) => {
  const { password } = req.cookies
  const passwordList = process.env.PASSWORD_LIST.split('|')
  for (const element of passwordList) {
    if (element.includes(unescape(password))) {
      next()
      return
    }
  }
  res.status(401).json({ error: 'unauthorized' })
}
