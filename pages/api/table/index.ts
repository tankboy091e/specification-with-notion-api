/* eslint-disable dot-notation */
import getHandler from 'lib/api/handler'
import {
  createInDatabase,
  createInTodo,
  getDatabaseQuery,
  databaseProperties,
  todoProperties,
  retreive,
  retreiveBlock,
} from 'lib/db/notion'
import validateAuth from 'lib/middleware/validate-auth'
import { NextApiRequest, NextApiResponse } from 'next'

const handler = getHandler()

handler.use(validateAuth)

handler.get(async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const keys = [...databaseProperties, ...todoProperties]
    const table = await getDatabaseTable()
    res.status(200).json({ keys, table })
  } catch (error) {
    res.status(500).json({ error })
  }
})

async function getDatabaseTable() {
  const keys = [...databaseProperties, ...todoProperties]
  const query = await getDatabaseQuery()
  const result = []
  for (let i = 0; i < query.results.length; i++) {
    // eslint-disable-next-line no-plusplus
    const value = query.results[i]
    const { id } = value
    const row = {
      id,
    }
    for await (const key of keys) {
      const pid = row['문서'] && row['문서'][0]
      if (key === '상태') {
        if (i > 0) {
          const previousId = result[i - 1]['문서'][0]
          if (previousId === pid) {
            row[key] = result[i - 1]['상태']
            continue
          }
        }
        try {
          const response = await retreive(pid)
          row[key] = response.properties['상태']['select']
        } catch {
          row[key] = null
        }
        continue
      }
      if (key === '기능') {
        try {
          const response = await retreiveBlock(pid)
          const { content } = value.properties['기능']['rich_text'][0].text
          // eslint-disable-next-line no-loop-func
          const block = response.results
            .find((result) => content === result[result.type].text[0].text.content)
          const { checked } = block['to_do']
          row[key] = {
            content,
            checked,
          }
        } catch {
          row[key] = null
        }
        continue
      }
      if (key === '배정') {
        try {
          if (i > 0) {
            const previousId = result[i - 1]['문서'][0]
            if (previousId === pid) {
              row[key] = result[i - 1]['배정']
              continue
            }
          }
          const response = await retreive(pid)
          const content = response.properties['배정']['people']
          // eslint-disable-next-line camelcase
          row[key] = content
        } catch {
          row[key] = null
        }
        continue
      }
      const property = value.properties[key]
      if (!property) {
        row[key] = null
        continue
      }
      const { type } = property
      const content = property[type]
      if (
        type === 'checkbox'
        || type === 'number'
        || type === 'url'
        || type === 'created_time'
        || type === 'last_edited_time'
      ) {
        row[key] = content
        continue
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
    }
    result.push(row)
  }
  return result
}

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const rows = req.body

    for await (const row of rows) {
      const { id, ...data } = row
      const { pageId, blockId } = await createInTodo(data)
      data['문서'] = pageId
      data['블록'] = blockId
      await createInDatabase(data)
    }
    res.status(201).json({ message: 'resource posted successfully' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

export default handler
