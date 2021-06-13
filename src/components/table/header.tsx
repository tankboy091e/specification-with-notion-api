import HEAD_LIST from 'lib/util/const'
import styles from 'sass/components/table.module.scss'
import { useTable } from '.'

const { ETC } = HEAD_LIST

export default function TableHeader() {
  const { heads, arrange } = useTable()

  return (
    <tr className={styles.row}>
      {heads.map((head) => {
        if (head === ETC) {
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
