/* eslint-disable no-console */
/* eslint-disable dot-notation */
import {
  BlocksChildrenListResponse,
  DatabasesQueryResponse,
  PagesRetrieveResponse,
} from '@notionhq/client/build/src/api-endpoints'
import HEAD_LIST from 'lib/util/const'
import { getDatabaseQuery, retreive, retreiveBlock } from './notion'

const { DOC } = HEAD_LIST

interface Query {
  [key: string]: {
    head: PagesRetrieveResponse
    block: BlocksChildrenListResponse
  }
}

class Cache {
  private database: DatabasesQueryResponse

  private queries: Query

  public async getDatabase() {
    if (!this.database) {
      await this.loadDatabase()
    }
    return this.database
  }

  public async getQueries() {
    if (!this.queries) {
      this.initializeQueries()
    }

    const promises = Object.keys(this.queries).map((id) => (
      new Promise((resolve, reject) => {
        if (!this.queries[id]) {
          this.loadQuery(id)
            .then((response) => {
              if (!response) {
                reject()
              }
              this.queries[id] = response
              resolve(null)
            })
        } else {
          resolve(null)
        }
      })
    ))

    await Promise.all(promises)

    return this.queries
  }

  private initializeQueries() {
    this.queries = this.database.results.reduce((acc, cur) => {
      const newQuery = {}
      newQuery[cur.properties[DOC]['rich_text'][0].text.content] = null
      return {
        ...acc,
        ...newQuery,
      }
    }, {})
  }

  private async loadDatabase() {
    const timestart = new Date().getTime()
    console.log('fetch database ...')
    this.database = await getDatabaseQuery()
    console.log(`got database. ${new Date().getTime() - timestart}ms`)
  }

  private async loadQuery(id: string) {
    try {
      const timestart = new Date().getTime()
      console.log(`fetch doc#${id} ...`)
      const head = await retreive(id)
      console.log(`got header. ${new Date().getTime() - timestart}ms`)
      try {
        const timestart2 = new Date().getTime()
        const block = await retreiveBlock(id)
        console.log(`got blocks. ${new Date().getTime() - timestart2}ms`)
        return {
          head,
          block,
        }
      } catch (error) {
        return {
          head,
          block: null,
        }
      }
    } catch (error) {
      return {
        head: null,
        block: null,
      }
    }
  }
}

export default Cache
