import { cn } from 'lib/util'
import HEAD_LIST from 'lib/util/const'
import { useEffect, useRef } from 'react'
import styles from 'sass/components/table.module.scss'
import Loading from 'widgets/loading'
import { useTable } from '..'
import { RowData } from '.'

const {
  STATE, ROUTE, ID, COMPONENT, FUNCTION, REMARK, ETC,
} = HEAD_LIST

export default function InputRow({
  index,
  data,
  edit,
}: {
  index: number,
  data?: RowData
  edit?: boolean,
}) {
  const {
    state, heads, cancle,
  } = useTable()

  const textareaKeys = [ROUTE, ID, COMPONENT, FUNCTION, REMARK]

  const textareaRef = useRef<{
    [key: string]: HTMLTextAreaElement
  }>({})

  const isEditing = (head: string) => ((head === COMPONENT || head === FUNCTION) && edit)

  const getValue = (head: string) => {
    switch (head) {
      case ETC:
        return (
          <button className={styles.cancle} type="button" onClick={() => cancle(index)}>
            취소
          </button>
        )
      default:
        if (textareaKeys.includes(head)) {
          return (
            <textarea
              className={cn(styles.input, (head === FUNCTION && edit) && styles.resize)}
              ref={(ref) => { textareaRef.current[head] = ref }}
              name={head}
              placeholder="여기에 입력하세요"
              disabled={isEditing(head)}
            />
          )
        }
        return null
    }
  }

  useEffect(() => {
    if (!data) {
      return
    }
    for (const key of textareaKeys) {
      if (!data[key]) {
        continue
      }
      if (textareaRef.current[key].value) {
        continue
      }
      if (key === FUNCTION) {
        textareaRef.current[key].value = data[key].content
        continue
      }
      textareaRef.current[key].value = data[key]
    }
  }, [data])

  return (
    <tr className={cn(styles.row, 'inputRow')}>
      {heads.map((head: any) => (
        <td
          key={`${head}input}`}
          colSpan={state === 'pending' ? heads.length : 1}
          className={cn(styles.inputCell, (head !== STATE && state === 'pending') && styles.pending)}
        >
          {state === 'pending' && <Loading size={32} />}
          <div className={cn(styles.inputWrapper, state === 'pending' && styles.pending)}>
            {getValue(head) || '-'}
          </div>
        </td>
      ))}
    </tr>
  )
}
