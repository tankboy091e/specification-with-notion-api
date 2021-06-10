import { cn } from 'lib/util'
import styles from 'sass/components/table.module.scss'
import Loading from 'widgets/loading'
import { useTable } from '.'

export default function InputRow({ index }: { index: number }) {
  const { state, keys, onCancle } = useTable()

  const id = null

  return (
    <tr id={id} className={cn(styles.row, 'inputRow')}>
      {keys.map((key: any) => {
        const getValue = () => {
          if (state === 'pending') {
            return <Loading size={32} />
          }
          if (key === '최종편집일시' || key === '배정') {
            return '-'
          }
          if (key === '기타') {
            return <button className={styles.cancle} type="button" onClick={() => onCancle(index)}>취소</button>
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
          const textareaKeys = ['경로', '아이디', '컴포넌트', '기능', '비고']
          if (textareaKeys.includes(key)) {
            return <textarea className={cn(styles.input, key === '기능' && styles.resize)} name={key} placeholder="여기에 입력하세요" />
          }
          return '-'
        }
        return (
          <td key={`${key}input}`} className={styles.inputCell}>
            {getValue()}
          </td>
        )
      })}
    </tr>
  )
}
