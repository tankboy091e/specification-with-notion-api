/* eslint-disable dot-notation */
import getHandler from 'lib/api/handler'
import { getQuery, properties } from 'lib/db/notion'
import validateAuth from 'lib/middleware/validate-auth'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = getHandler()

handler.use(validateAuth)

handler.get(async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const keys = properties
    const query = await getQuery()
    const table = query.results.map((value) => {
      const { id } = value
      const row = {
        id,
      }
      keys.forEach((key) => {
        const property = value.properties[key]
        if (!property) {
          row[key] = {
            type: null,
            value: null,
          }
          return
        }
        const { type } = property
        const content = value.properties[key][type]
        if (
          type === 'checkbox'
          || type === 'number'
          || type === 'url'
          || type === 'created_time'
          || type === 'last_edited_time'
        ) {
          row[key] = {
            type,
            value: content,
          }
          return
        }
        row[key] = {
          type,
          value: content.map((child: any) => {
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
          }),
        }
      })
      return row
    })
    const data = {
      keys,
      table,
    }
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error })
  }
})

export default handler
