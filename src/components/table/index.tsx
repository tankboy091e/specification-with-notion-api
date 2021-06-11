import fetcher from 'lib/api/fetcher'
import HEAD_LIST from 'lib/util/const'
import React, {
  createContext, SetStateAction, useContext, useEffect, useRef, useState,
} from 'react'
import styles from 'sass/components/table.module.scss'
import useSWR from 'swr'
import AddButton from 'widgets/add-button'
import TableBody from './body'
import Colgroup from './colgroup'
import TableForm from './form'
import TableHeader from './header'

const {
  STATE, ROUTE, ID, COMPONENT, FUNCTION, REMARK, ASSIGN, EDIT_TIME, ETC,
} = HEAD_LIST

interface Arrange {
  head: string
  way: number
}

interface TableContextProps {
  table: any[]
  heads: string[]
  state: State
  setState: React.Dispatch<SetStateAction<State>>
  currentArrange: Arrange
  arrange: (head: string) => void
  inputs: number[]
  defaultInputData: { [key: string]: string }
  setDefaultInputData: React.Dispatch<SetStateAction<{ [key: string]: string }>>
  cancle: (index: number) => void
}

const TableContext = createContext<TableContextProps>(null)

export const useTable = () => useContext(TableContext)

export type State = 'default' | 'pending'

export default function Table() {
  const { data: table, mutate } = useSWR('/api/table', fetcher)

  const [state, setState] = useState<State>('default')
  const [inputs, setInputs] = useState<number[]>([])
  const [defaultInputData, setDefaultInputData] = useState<{ [key: string]: string }>(null)
  const [currentArrange, setCurrentArrage] = useState<Arrange>({ head: STATE, way: -1 })
  const [arrangeData, setArrangeData] = useState<{ [key: string]: number }>({})

  const arrangeDataRef = useRef(arrangeData)

  const heads = [STATE, ROUTE, ID, COMPONENT, FUNCTION, REMARK, ASSIGN, EDIT_TIME, ETC]

  const arrange = (head : string) => {
    setCurrentArrage((arrange) => {
      const { head: previouseKey, way } = arrange
      if (previouseKey === head) {
        return {
          head,
          way: way * -1,
        }
      }
      return {
        head,
        way: -1,
      }
    })
  }

  const add = () => {
    setInputs((array) => [...array, Math.random()])
  }

  const cancle = (index: number) => {
    setInputs(inputs.filter((input) => input !== index))
  }

  useEffect(() => {
    if (state === 'default') {
      mutate()
      setInputs([])
    }
  }, [state])

  useEffect(() => {
    if (defaultInputData) {
      setDefaultInputData(null)
    }
  }, [defaultInputData])

  useEffect(() => {
    arrangeDataRef.current = arrangeData
  }, [arrangeData])

  useEffect(() => {
    if (inputs.length > 0) {
      window.scrollTo({ behavior: 'smooth', top: document.body.scrollHeight })
    }
  }, [inputs])

  useEffect(() => {
    const defaultArrangeData = {}
    heads.forEach((value) => {
      defaultArrangeData[value] = 1
    })
    setArrangeData(defaultArrangeData)
  }, [])

  const value = {
    table,
    state,
    setState,
    currentArrange,
    arrange,
    inputs,
    defaultInputData,
    setDefaultInputData,
    heads,
    cancle,
  }

  return (
    <section className={styles.container}>
      <TableContext.Provider value={value}>
        <TableForm>
          <table className={styles.table}>
            <Colgroup />
            <tbody className={styles.body}>
              <TableHeader />
              <TableBody />
            </tbody>
          </table>
          {inputs.length > 0 && <input className={styles.submit} type="submit" value="제출" />}
        </TableForm>
      </TableContext.Provider>
      <AddButton onClick={add} />
    </section>
  )
}
