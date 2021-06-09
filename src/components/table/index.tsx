import fetcher from 'lib/api/fetcher'
import { createContext, useContext, useState } from 'react'
import styles from 'sass/components/table.module.scss'
import useSWR from 'swr'
import AddButton from 'widgets/add-button'
import Loading from 'widgets/loading'
import InputRow from './inputRow'
import Row from './row'

interface TableContextProps {
  keys: string[]
  onCancle: (index: number) => void
}

const TableContext = createContext<TableContextProps>(null)

export const useTable = () => useContext(TableContext)

export default function Table() {
  const { data, error } = useSWR('/api/table', fetcher)
  const [inputs, setInputs] = useState<number[]>([])

  if (error) {
    <>something went wrong</>
  }

  if (!data) {
    return (
      <section className={styles.container}>
        <Loading />
      </section>
    )
  }

  const onAdd = () => {
    setInputs((array) => [...array, Math.random()])
  }

  const onCancle = (index: number) => {
    setInputs(inputs.filter((value) => value !== index))
  }

  const { keys, table } = data

  const extendedKeys = keys.concat('기타').filter((key: string) => key !== '완료')

  const value = {
    keys: extendedKeys,
    onCancle,
  }

  return (
    <section className={styles.container}>
      <TableContext.Provider value={value}>
        <table className={styles.table}>
          <tbody className={styles.body}>
            <tr className={styles.row}>
              {extendedKeys.map((key: any) => (
                <th key={key} className={styles.cell}>{key}</th>
              ))}
            </tr>
            {
              table.map((element: any) => (
                <Row key={element.id} element={element} />
              ))
            }
            {
              inputs.map((key) => (
                <InputRow key={key} index={key} />
              ))
            }
          </tbody>
        </table>
        <AddButton onClick={onAdd} />
      </TableContext.Provider>
    </section>
  )
}
