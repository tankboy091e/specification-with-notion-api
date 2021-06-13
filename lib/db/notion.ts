/* eslint-disable dot-notation */
/* eslint-disable no-shadow */
import { Client } from '@notionhq/client'
import HEAD_LIST, { TITLE } from 'lib/util/const'

const notion = new Client({
  auth: process.env.NOTION_KEY,
})

export default notion

export const databaseId = process.env.NOTION_DATABASE_ID
export const todoId = process.env.NOTION_TODO_ID

const {
  DOC, STATE, ROUTE, ID, COMPONENT, FUNCTION, REMARK, ASSIGN, EDIT_TIME, BLOCK,
} = HEAD_LIST

export const databaseProperties = [DOC, ROUTE, ID, COMPONENT, FUNCTION, REMARK, EDIT_TIME, BLOCK]

export const todoProperties = [STATE, ASSIGN]

async function getDatabases(id: string) {
  const response = await notion.databases.retrieve({
    database_id: id,
  })
  return response
}

export async function getDatabase() {
  return getDatabases(databaseId)
}

export async function getTodo() {
  return getDatabases(todoId)
}

async function getQuery(id: string, sorts?: any) {
  const response = await notion.databases.query({
    database_id: id,
    sorts,
  })
  return response
}

export async function getDatabaseQuery() {
  return getQuery(databaseId, [
    {
      property: DOC,
      direction: 'ascending',
    },
  ])
}

export async function getTodoQuery() {
  return getQuery(todoId)
}

export async function retreive(pid: string) {
  const response = await notion.pages.retrieve({
    page_id: pid,
  })
  return response
}

export async function retreiveBlock(pid: string) {
  const response = await notion.blocks.children.list({
    block_id: pid,
    page_size: 50,
  })
  return response
}

export async function createInDatabase(data: any) {
  const database = await getDatabase()

  // eslint-disable-next-line no-shadow
  const properties = {}

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const property = database.properties[key]
      if (!property) {
        continue
      }
      const getValue = () => {
        const { type } = property
        if (type === 'title') {
          return {
            title: [
              {
                text: {
                  content: data[key],
                },
              },
            ],
          }
        }
        if (type === 'rich_text') {
          return {
            rich_text: [
              {
                text: {
                  content: data[key],
                },
              },
            ],
          }
        }
        return null
      }
      const value = getValue()
      if (!value) {
        continue
      }
      properties[key] = value
    }
  }

  const response = await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties,
  })

  return response
}

export async function createInTodo(data: any) {
  const result = {
    pageId: null,
    blockId: null,
  }

  const properties = {}
  const children = []

  const todoQueryResponse = await getTodoQuery()

  const existingTodo = todoQueryResponse.results
    .find((value) => value.properties[TITLE][value.properties[TITLE].type]
      .find((value : any) => value?.text?.content === data[ID]))

  if (!existingTodo) {
    properties[TITLE] = {
      title: [
        {
          text: {
            content: data[ID],
          },
        },
      ],
    }
    properties[STATE] = {
      select: {
        name: '시작 전',
      },
    }
    const headingBlock = {
      object: 'block',
      type: 'heading_2',
      heading_2: {
        text: [
          {
            type: 'text',
            text: {
              content: data[COMPONENT],
            },
          },
        ],
      },
    }
    children.push(headingBlock)
  } else {
    result.pageId = existingTodo.id

    const stateProperty = existingTodo.properties[STATE]
    const { id } = stateProperty[stateProperty.type]

    if (id === '3') {
      const updateProperties = {}
      updateProperties[STATE] = {
        select: {
          id: '2',
        },
      }
      await notion.pages.update({
        page_id: result.pageId,
        properties: updateProperties,
      })
    }
    const todoBlocks = await retreiveBlock(result.pageId)

    const existingHeading = todoBlocks.results
      .find((value) => value['heading_2']?.text[0]?.text?.content === data[COMPONENT])

    if (!existingHeading) {
      const headingBlock = {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          text: [
            {
              type: 'text',
              text: {
                content: data[COMPONENT],
              },
            },
          ],
        },
      }
      children.push(headingBlock)
    }
  }

  const todoBlock = {
    object: 'block',
    type: 'to_do',
    to_do: {
      text: [
        {
          type: 'text',
          text: {
            content: data[FUNCTION],
          },
        },
      ],
    },
  }
  children.push(todoBlock)

  if (!existingTodo) {
    const response = await notion.pages.create({
      parent: {
        database_id: todoId,
      },
      properties,
      children,
    })
    result.pageId = response.id
  } else {
    await notion.blocks.children.append({
      block_id: result.pageId,
      children,
    })
  }

  const pageResponse = await retreiveBlock(result.pageId)

  const { id: blockId } = pageResponse.results.find((value) => value.type === 'to_do')

  result.blockId = blockId

  return result
}
