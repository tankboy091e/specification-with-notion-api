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

interface TableContextProps {
  state: State,
  defaultInputData: { [key: string]: string }
  keys: string[]
  cancle: (index: number) => void
  onTableHeadClick: (key:string, content: string) => void
}

const TableContext = createContext<TableContextProps>(null)

export const useTable = () => useContext(TableContext)

type State = 'default' | 'pending'

export default function Table() {
  const { data, mutate } = useSWR('/api/table', fetcher)

  const [state, setState] = useState<State>('default')
  const [inputs, setInputs] = useState<number[]>([])
  const [defaultInputData, setDefaultInputData] = useState<{ [key: string]: string }>(null)
  const [currentArrange, setCurrentArrage] = useState<{key: string, way: number}>({ key: '상태', way: -1 })
  const [arrangeData, setArrangeData] = useState<{ [key: string]: number }>({})

  const arrangeDataRef = useRef(arrangeData)

  const keys = ['상태', '문서', '경로', '아이디', '컴포넌트', '기능', '비고', '배정', '최종편집일시', '기타']

  useEffect(() => {
    if (defaultInputData) {
      setDefaultInputData(null)
    }
  }, [defaultInputData])

  useEffect(() => {
    arrangeDataRef.current = arrangeData
  }, [arrangeData])

  useEffect(() => {
    const defaultArrangeData = {}
    keys.forEach((value) => {
      defaultArrangeData[value] = 1
    })
    setArrangeData(defaultArrangeData)
  }, [])

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
      const va = a[key].value
      const vb = b[key].value
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
        case '문서':
          return {
            va: va[0],
            vb: vb[0],
          }
        case '기능':
          return {
            va: a[key].value.content,
            vb: b[key].value.content,
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

  const onTableHeadClick = (key: string, content: string) => {
    const newData = {}
    newData[key] = content
    setDefaultInputData({
      ...defaultInputData,
      ...newData,
    })
  }

  const colRatio : number[] = keys.map((key: string) => {
    switch (key) {
      case '기능':
        return 5
      case '비고':
        return 2.5
      case '컴포넌트':
        return 2.5
      case '최종편집일시':
        return 2
      case '경로':
        return 2
      case '아이디':
        return 2
      case '배정':
        return 1.5
      default:
        return 1
    }
  })

  const colTotal = colRatio.reduce((acc, cur) => (
    acc + cur
  ), 0)

  const value = {
    state,
    defaultInputData,
    keys,
    cancle,
    onTableHeadClick,
  }

  if (!data) {
    return (
      <section className={styles.container}>
        <Loading />
      </section>
    )
  }

  const { table } = data
  const { key, way } = currentArrange

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
                table.sort((a : any, b: any) => sort(key, way, a, b)).map((element: any) => (
                  <Row key={element.id} element={element} />
                ))
              }
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
