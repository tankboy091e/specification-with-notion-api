/* eslint-disable dot-notation */
import getHandler from 'lib/api/handler'
import { getDatabase, getQuery } from 'lib/db/notion'
import validateAuth from 'lib/middleware/validate-auth'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = getHandler()

handler.use(validateAuth)

handler.get(async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const database = await getDatabase()
    const keys = Object.keys(database.properties)
    const query = await getQuery()
    const data = query.results.map((value) => {
      const { id } = value
      const row = {
        id,
      }
      keys.forEach((key) => {
        const property = value.properties[key]
        if (!property) {
          row[key] = null
          return
        }
        const { type } = property
        const content = value.properties[key][type]
        if (type === 'checkbox'
        || type === 'url'
        || type === 'last_edited_time'
        || type === 'created_time') {
          row[key] = content
          return
        }
        row[key] = content.map((child: any) => {
          const { type: contentType } = child
          if (!contentType) {
            return child.name
          }
          switch (contentType) {
            case 'text':
              return child.text.content
            case 'person':
              return child.name
            default:
              return null
          }
        })
      })
      return row
    })
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error })
  }
})

export default handler
