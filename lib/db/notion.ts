import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_KEY,
})

export default notion

export const databaseId = process.env.NOTION_DATABASE_ID

export const properties = ['상태', '경로', '아이디', '컴포넌트', '기능', '완료', '담당자', '비고', '최종편집일시']

export async function getDatabase() {
  const response = await notion.databases.retrieve({
    database_id: databaseId,
  })
  return response
}

export async function getQuery() {
  const response = await notion.databases.query({
    database_id: databaseId,
  })
  return response
}

export async function getBlock(blockId: string) {
  const response = await notion.blocks.children.list({
    block_id: blockId,
  })
  return response
}

// eslint-disable-next-line no-unused-vars
async function adadItem(text: string) {
  try {
    await notion.request({
      path: 'pages',
      method: 'post',
      body: {
        parent: { database_id: databaseId },
        properties: {
          title: {
            title: [
              {
                text: {
                  content: text,
                },
              },
            ],
          },
        },
      },
    })
    console.log('success')
  } catch (error) {
    console.error(error.body)
  }
}
