import styles from 'sass/components/table.module.scss'
import { useTable } from '.'

export default function TableHeader() {
  const { heads, arrange } = useTable()

  return (
    <tr className={styles.row}>
      {heads.map((head: any) => {
        if (head === '기타') {
          return (
            <th key={head} className={styles.cell}>
              <div className={styles.inner}>
                <div className={styles.button}>{head}</div>
              </div>
            </th>
          )
        }
        return (
          <th key={head} className={styles.cell}>
            <div className={styles.inner}>
              <button
                className={styles.button}
                type="button"
                onClick={() => arrange(head)}
              >
                {head}
              </button>
            </div>
          </th>
        )
      })}
    </tr>
  )
}
