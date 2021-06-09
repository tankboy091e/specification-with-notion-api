import styles from 'sass/components/table.module.scss'
import { useTable } from '.'

export default function InputRow({ index }: { index: number }) {
  const { keys, onCancle } = useTable()

  return (
    <tr className={styles.row}>
      {keys.map((key: any) => {
        const getValue = () => {
          if (key === '최종편집일시') {
            return <input type="submit" value="제출" />
          }
          if (key === '기타') {
            return <button type="button" onClick={() => onCancle(index)}>취소</button>
          }
          if (key === '담당자') {
            const list = process.env.MEMBER_LIST.split('|')
            return (
              <select key={key}>
                {list.map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            )
          }
          const inputKeys = ['경로', '아이디', '컴포넌트']
          if (inputKeys.includes(key)) {
            return <input type="text" />
          }
          const textareaKeys = ['기능', '비고']
          if (textareaKeys.includes(key)) {
            return <textarea />
          }
          return null
        }
        return (
          <td key={`${key}input}`} className={styles.cell}>
            {getValue()}
          </td>
        )
      })}
    </tr>
  )
}
