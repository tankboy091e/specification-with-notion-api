/* eslint-disable dot-notation */
/* eslint-disable no-shadow */
import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_KEY,
})

export default notion

export const databaseId = process.env.NOTION_DATABASE_ID
export const todoId = process.env.NOTION_TODO_ID

export const databaseProperties = ['문서', '경로', '아이디', '컴포넌트', '기능', '비고', '최종편집일시']

export const todoProperties = ['상태', '배정']

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

async function getQuery(id: string) {
  const response = await notion.databases.query({
    database_id: id,
  })
  return response
}

export async function getDatabaseQuery() {
  return getQuery(databaseId)
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

  for (const property in data) {
    if (Object.prototype.hasOwnProperty.call(data, property)) {
      const { type } = database.properties[property]
      const getValue = () => {
        if (type === 'title') {
          return {
            title: [
              {
                text: {
                  content: data[property],
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
                  content: data[property],
                },
              },
            ],
          }
        }
        return null
      }
      properties[property] = getValue()
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
  const properties = {}
  properties['이름'] = {
    title: [
      {
        text: {
          content: data['아이디'],
        },
      },
    ],
  }
  properties['상태'] = {
    select: {
      name: '시작 전',
    },
  }

  const children = []

  const headingBlock = {
    object: 'block',
    type: 'heading_2',
    heading_2: {
      text: [
        {
          type: 'text',
          text: {
            content: data['컴포넌트'],
          },
        },
      ],
    },
  }
  children.push(headingBlock)

  const todoBlock = {
    object: 'block',
    type: 'to_do',
    to_do: {
      text: [
        {
          type: 'text',
          text: {
            content: data['기능'],
          },
        },
      ],
    },
  }
  children.push(todoBlock)

  const response = await notion.pages.create({
    parent: {
      database_id: todoId,
    },
    properties,
    children,
  })
  return response
}
