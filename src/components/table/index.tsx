import fetcher from 'lib/api/fetcher'
import hermes from 'lib/api/hermes'
import {
  createContext, FormEvent, useContext, useEffect, useRef, useState,
} from 'react'
import styles from 'sass/components/table.module.scss'
import useSWR from 'swr'
import AddButton from 'widgets/add-button'
import Loading from 'widgets/loading'
import InputRow from './inputRow'
import Row from './row'

interface Arrange {
  key: string
  way: number
}

interface TableContextProps {
  table: any[]
  state: State
  currentArrange: Arrange
  defaultInputData: { [key: string]: string }
  keys: string[]
  cancle: (index: number) => void
  onCellClick: (key:string, content: string) => void
}

const TableContext = createContext<TableContextProps>(null)

export const useTable = () => useContext(TableContext)

type State = 'default' | 'pending'

export default function Table() {
  const { data, mutate } = useSWR('/api/table', fetcher)

  const [state, setState] = useState<State>('default')
  const [inputs, setInputs] = useState<number[]>([])
  const [defaultInputData, setDefaultInputData] = useState<{ [key: string]: string }>(null)
  const [currentArrange, setCurrentArrage] = useState<Arrange>({ key: '상태', way: -1 })
  const [arrangeData, setArrangeData] = useState<{ [key: string]: number }>({})

  const arrangeDataRef = useRef(arrangeData)

  const keys = ['상태', '경로', '아이디', '컴포넌트', '기능', '비고', '배정', '최종편집일시', '기타']

  const colRatioData = {
    기능: 5,
    비고: 2.5,
    컴포넌트: 2.5,
    최종편집일시: 2,
    경로: 2,
    아이디: 2,
    배정: 1.5,
  }

  const colRatio : number[] = keys.map((key: string) => colRatioData[key] || 1)

  const colTotal = colRatio.reduce((acc, cur) => (
    acc + cur
  ), 0)

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
    const { message } = await res.json()
    alert(message)
    mutate()
    setInputs([])
    setState('default')
  }

  const sort = (key: string, way: number, a: any, b: any) => {
    const getValue = () => {
      try {
        const va = a[key]
        const vb = b[key]
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
        switch (key) {
          case '상태':
            return {
              va: va.id,
              vb: vb.id,
            }
          case '기능':
            return {
              va: a[key].content,
              vb: b[key].content,
            }
          case '배정':
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
    if (va > vb) return -1 * way
    if (va < vb) return 1 * way
    return 0
  }

  const arrange = (key : string) => {
    setCurrentArrage((arrange) => {
      const { key: previouseKey, way } = arrange
      if (previouseKey === key) {
        return {
          key,
          way: way * -1,
        }
      }
      return {
        key,
        way: -1,
      }
    })
  }

  const add = () => {
    setInputs((array) => [...array, Math.random()])
  }

  const cancle = (index: number) => {
    setInputs(inputs.filter((value) => value !== index))
  }

  const onCellClick = (key: string, content: string) => {
    const newData = {}
    newData[key] = content
    setDefaultInputData({
      ...defaultInputData,
      ...newData,
    })
  }

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
    keys.forEach((value) => {
      defaultArrangeData[value] = 1
    })
    setArrangeData(defaultArrangeData)
  }, [])

  const value = {
    table: data?.table,
    state,
    currentArrange,
    defaultInputData,
    keys,
    cancle,
    onCellClick,
  }

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
                {keys.map((key: any) => {
                  if (key === '기타') {
                    return (
                      <th key={key} className={styles.cell}>
                        <div className={styles.inner}>
                          <div className={styles.button}>
                            {key}
                          </div>
                        </div>
                      </th>
                    )
                  }
                  return (
                    <th key={key} className={styles.cell}>
                      <div className={styles.inner}>
                        <button className={styles.button} type="button" onClick={() => arrange(key)}>
                          {key}
                        </button>
                      </div>
                    </th>
                  )
                })}
              </tr>
              {
                data && data.table
                  .sort((a : any, b: any) => {
                    const { key, way } = currentArrange
                    return sort(key, way, a, b)
                  })
                  .map((value: any, index: number) => (
                    <Row key={value.id} index={index} element={value} />
                  ))
              }
              {!data && (
                <tr>
                  <td className={styles.loadingContainer} colSpan={colRatio.length}>
                    <Loading />
                  </td>
                </tr>
              )}
              {
                inputs.map((key) => (
                  <InputRow key={key} index={key} data={defaultInputData} />
                ))
              }
            </tbody>
          </table>
          {inputs.length > 0 && <input className={styles.submit} type="submit" value="제출" />}
          <AddButton onClick={add} />
        </TableContext.Provider>
      </form>
    </section>
  )
}
