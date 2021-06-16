import HEAD_LIST from 'lib/util/const'
import styles from 'sass/components/table.module.scss'
import Loading from 'widgets/loading'
import { useTable } from '..'
import Row from '../row'

const {
  STATE, FUNCTION, ASSIGN, COMPONENT, ID, EDIT_TIME,
} = HEAD_LIST

export default function TableBody() {
  const {
    table, heads, currentArrange,
  } = useTable()

  const getValue = (head: string, element: any) => {
    try {
      const value = element[head]
      if (!value) {
        return null
      }
      const getAssignValue = (value : any) => {
        if (value.length > 0) {
          return value[0].name
        }
        return ''
      }
      const convertIfArray = (value: any) => {
        if (Array.isArray(value)) {
          return value[0]
        }
        return value
      }
      switch (head) {
        case STATE:
          return value.id
        case FUNCTION:
          return value.content
        case ASSIGN:
          return getAssignValue(value)
        default:
          return convertIfArray(value)
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const sort = (head: string, way: number, a: any, b: any) => {
    const va = getValue(head, a)
    const vb = getValue(head, b)
    if (va > vb) return 1 * way
    if (va < vb) return -1 * way
    if (head === STATE) {
      return sort(ID, 1, a, b)
    }
    if (head === ID) {
      return sort(COMPONENT, 1, a, b)
    }
    if (head === COMPONENT) {
      return sort(EDIT_TIME, 1, a, b)
    }
    return 0
  }

  if (!table) {
    return (
      <tr>
        <td className={styles.loadingContainer} colSpan={heads.length}>
          <Loading />
        </td>
      </tr>
    )
  }

  return (
    <>
      {
        table
          .sort((a: any, b: any) => {
            const { head, way } = currentArrange
            return sort(head, way, a, b)
          })
          .map((value: any, index: number) => (
            <Row key={value.id} index={index} data={value} />
          ))
      }
    </>
  )
}
