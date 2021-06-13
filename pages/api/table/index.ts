/* eslint-disable no-console */
/* eslint-disable dot-notation */
import getHandler from 'lib/api/handler'
import Cache from 'lib/db/cache'
import {
  createInDatabase,
  createInTodo,
  databaseProperties,
  todoProperties,
} from 'lib/db/notion'
import validateAuth from 'lib/middleware/validate-auth'
import HEAD_LIST from 'lib/util/const'
import { NextApiRequest, NextApiResponse } from 'next'

const {
  DOC, STATE, FUNCTION, ASSIGN, BLOCK,
} = HEAD_LIST

const handler = getHandler()

handler.use(validateAuth)

handler.get(async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = await getDatabaseTable()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error })
  }
})

async function getDatabaseTable() {
  const keys = [...databaseProperties, ...todoProperties]

  const cache = new Cache()

  const databaseQuery = await cache.getDatabase()
  const todoQuery = await cache.getQueries()

  const result = []
  for (const value of databaseQuery.results) {
    const { id } = value
    const row = {
      id,
    }
    for (const key of keys) {
      const pid = row[DOC] && row[DOC][0]
      if (key === STATE) {
        try {
          const response = todoQuery[pid].head
          row[key] = response.properties[STATE]['select']
        } catch {
          row[key] = null
        }
        continue
      }
      if (key === FUNCTION) {
        try {
          const response = todoQuery[pid].block
          const { content } = value.properties[FUNCTION]['rich_text'][0].text
          // eslint-disable-next-line no-loop-func
          const block = response.results
            .find((result: any) => content === result[result.type].text[0]?.text?.content)
          const { checked } = block['to_do']
          row[key] = {
            content,
            checked,
          }
        } catch {
          row[key] = {
            content: null,
            checked: false,
          }
        }
        continue
      }
      if (key === ASSIGN) {
        try {
          const response = todoQuery[pid].head
          const content = response.properties[ASSIGN]['people']
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
      const { ...data } = row
      const { pageId, blockId } = await createInTodo(data)
      data[DOC] = pageId
      data[BLOCK] = blockId
      await createInDatabase(data)
    }
    res.status(201).json({ message: 'resource posted successfully' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

export default handler
