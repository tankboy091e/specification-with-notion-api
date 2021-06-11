import { cn } from 'lib/util'
import { useEffect, useRef } from 'react'
import styles from 'sass/components/table.module.scss'
import Loading from 'widgets/loading'
import { useTable } from '.'

interface Data {
  [key: string]: string
}

export default function InputRow({ index, data }: { index: number, data?: Data }) {
  const {
    state, keys, cancle,
  } = useTable()

  const textareaKeys = ['경로', '아이디', '컴포넌트', '기능', '비고']

  const textareaRef = useRef<{
    [key: string]: HTMLTextAreaElement
  }>({})

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
      textareaRef.current[key].value = data[key]
    }
  }, [data])

  return (
    <tr className={cn(styles.row, 'inputRow')}>
      {keys.map((key: any) => {
        const getValue = () => {
          if (key === '최종편집일시' || key === '배정') {
            return '-'
          }
          if (key === '기타') {
            return <button className={styles.cancle} type="button" onClick={() => cancle(index)}>취소</button>
          }
          if (key === '배정') {
            const list = ['없음', ...process.env.MEMBER_LIST.split('|')]
            return (
              <select key={key} className={styles.assign} name={key}>
                {list.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            )
          }
          if (textareaKeys.includes(key)) {
            return (
              <textarea
                className={cn(styles.input, key === '기능' && styles.resize)}
                // eslint-disable-next-line no-return-assign
                ref={(ref) => textareaRef.current[key] = ref}
                name={key}
                placeholder="여기에 입력하세요"
              />
            )
          }
          return '-'
        }
        return (
          <td key={`${key}input}`} className={styles.inputCell}>
            {state === 'pending' && <Loading size={28} />}
            {getValue()}
          </td>
        )
      })}
    </tr>
  )
}
