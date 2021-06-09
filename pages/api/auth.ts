import getHandler from 'lib/api/handler'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = getHandler()

handler.post((req: NextApiRequest, res: NextApiResponse) => {
  const { password } = req.body
  const passwordList = process.env.PASSWORD_LIST.split('|')
  // eslint-disable-next-line no-restricted-syntax
  for (const element of passwordList) {
    if (element.includes(password)) {
      const name = element.split('=')[1]
      res.status(200).json({ data: { name } })
      return
    }
  }
  res.status(404).json({ error: 'no user' })
})

export default handler
