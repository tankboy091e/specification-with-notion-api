import React from 'react'
import styles from 'sass/components/table.module.scss'
import { useTable } from '..'

export default function Cell({
  index,
  category: key,
  children,
}: {
  index: number
  category: string
  children: React.ReactNode
}) {
  const { table, currentArrange } = useTable()

  const getValueByKey = (key: string, element: any) => {
    try {
      if (!element) {
        return null
      }
      switch (key) {
        case '상태':
          return element.name
        case '최종편집일시':
          return null
        case '배정':
          return element[0]?.name
        case '기능':
          return null
        default:
          if (Array.isArray(element)) {
            if (element.length > 0) {
              return element[0]
            }
            return null
          }
          return element
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const isSameWithPrevious = () => {
    if (index === 0) {
      return false
    }
    const currentValue = table[index][key]
    const curr = getValueByKey(key, currentValue)
    if (!curr) {
      return false
    }
    const previousValue = table[index - 1][key]
    const prev = getValueByKey(key, previousValue)
    if (prev === curr) {
      return true
    }
    return false
  }

  if (isSameWithPrevious()) {
    return <></>
  }

  const extend = (i: number, acc: number) => {
    if (i < table.length - 1) {
      const currentValue = table[i][key]
      const nextValue = table[i + 1][key]
      const curr = getValueByKey(key, currentValue)
      const next = getValueByKey(key, nextValue)
      if (!curr || !next) {
        return acc
      }
      if (curr === next) {
        return extend(i + 1, acc + 1)
      }
      return acc
    }
    return acc
  }

  const rowspan = extend(index, 1)

  const getBackgroundColor = () => {
    if (currentArrange.key !== '상태') {
      return null
    }
    const functional = ['기능', '비고']
    if (functional.includes(key)) {
      if (table[index]['기능'].checked) {
        return 'green'
      }
      return 'red'
    }
    if (key === '컴포넌트') {
      const dependents = table
        .filter((row) => getValueByKey('컴포넌트', row) === getValueByKey('컴포넌트', table[index]))
      if (dependents.some((row) => row['기능'].checked === false)) {
        return 'red'
      }
      return 'green'
    }
    return table[index]['상태'].color
  }

  const backgroundColor = getBackgroundColor()

  return (
    <td rowSpan={rowspan} className={styles.cell}>
      <div className={styles.backgroundCell} style={{ backgroundColor }} />
      <div className={styles.cellWrapper}>{children}</div>
    </td>
  )
}
