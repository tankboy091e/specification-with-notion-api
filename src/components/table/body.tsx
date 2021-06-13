import HEAD_LIST from 'lib/util/const'
import styles from 'sass/components/table.module.scss'
import Loading from 'widgets/loading'
import { useTable } from '.'
import Row from './row'
import InputRow from './row/input'

const {
  STATE, FUNCTION, ASSIGN,
} = HEAD_LIST

export default function TableBody() {
  const {
    table, heads, currentArrange, inputs, defaultInputData,
  } = useTable()

  const sort = (head: string, way: number, a: any, b: any) => {
    const getValue = () => {
      try {
        const va = a[head]
        const vb = b[head]
        if (!va || !vb) {
          return {
            va,
            vb,
          }
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
            return {
              va: va.id,
              vb: vb.id,
            }
          case FUNCTION:
            return {
              va: a[head].content,
              vb: b[head].content,
            }
          case ASSIGN:
            return {
              va: getAssignValue(va),
              vb: getAssignValue(vb),
            }
          default:
            return {
              va: convertIfArray(va),
              vb: convertIfArray(vb),
            }
        }
      } catch (error) {
        console.log(error)
        return {
          va: null,
          vb: null,
        }
      }
    }
    const { va, vb } = getValue()
    if (va > vb) return 1 * way
    if (va < vb) return -1 * way
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
      {
        inputs.map((head) => (
          <InputRow key={head} index={head} data={defaultInputData} />
        ))
      }
    </>
  )
}
