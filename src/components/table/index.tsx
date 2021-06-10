import fetcher from 'lib/api/fetcher'
import hermes from 'lib/api/hermes'
import {
  createContext, FormEvent, useContext, useState,
} from 'react'
import styles from 'sass/components/table.module.scss'
import useSWR from 'swr'
import AddButton from 'widgets/add-button'
import Loading from 'widgets/loading'
import InputRow from './inputRow'
import Row from './row'

interface TableContextProps {
  state: State,
  keys: string[]
  onCancle: (index: number) => void
}

const TableContext = createContext<TableContextProps>(null)

export const useTable = () => useContext(TableContext)

type State = 'default' | 'pending'

export default function Table() {
  const [state, setState] = useState<State>('default')

  const { data, mutate } = useSWR('/api/table', fetcher)
  const [inputs, setInputs] = useState<number[]>([])

  if (!data) {
    return (
      <section className={styles.container}>
        <Loading />
      </section>
    )
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('pending')
    const inputRow : Element[] = []
    e.currentTarget.querySelectorAll('.inputRow').forEach((element) => {
      inputRow.push(element)
    })
    const payload = inputRow.map((element) => {
      const { id } = element
      const payloadData = {
        id,
      }

      const textareas = element.querySelectorAll('textarea').values()
      const validations = ['경로', '아이디', '컴포넌트', '기능']

      for (const textarea of textareas) {
        const name = textarea.getAttribute('name')
        const { value } = textarea
        if (validations.includes(name) && !value) {
          return null
        }
        payloadData[name] = value
      }
      return payloadData
    })

    if (payload.includes(null)) {
      alert('빈칸을 채워주세요')
      setState('default')
      return
    }

    const res = await hermes('/api/table', {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    if (!res.ok) {
      const { error } = await res.json()
      alert(error)
      setState('default')
      return
    }
    mutate()
    setState('default')
  }

  const onAdd = () => {
    setInputs((array) => [...array, Math.random()])
  }

  const onCancle = (index: number) => {
    setInputs(inputs.filter((value) => value !== index))
  }

  const { table } = data

  const keys = ['상태', '문서', '경로', '아이디', '컴포넌트', '기능', '비고', '배정', '최종편집일시', '기타']

  const value = {
    state,
    keys,
    onCancle,
  }

  const colRatio : number[] = keys.map((key: string) => {
    switch (key) {
      case '기능':
        return 3
      case '상태':
        return 0.5
      case '배정':
        return 0.5
      case '문서':
        return 0.5
      case '기타':
        return 0.5
      case '비고':
        return 1.5
      default:
        return 1
    }
  })

  const colTotal = colRatio.reduce((acc, cur) => (
    acc + cur
  ), 0)

  return (
    <section className={styles.container}>
      <form className={styles.form} onSubmit={onSubmit}>
        <TableContext.Provider value={value}>
          <table className={styles.table}>
            <colgroup>
              {
              colRatio
                .map((ratio, index) => (
                  <col key={keys[index]} width={`${Math.floor((ratio / colTotal) * 100)}%`} />
                ))
              }
            </colgroup>
            <tbody className={styles.body}>
              <tr className={styles.row}>
                {keys.map((key: any) => (
                  <th key={key} className={styles.cell}>
                    <div className={styles.inner}>
                      {key}
                    </div>
                  </th>
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
          {inputs.length > 0 && <input className={styles.submit} type="submit" value="제출" />}
          <AddButton onClick={onAdd} />
        </TableContext.Provider>
      </form>
    </section>
  )
}
