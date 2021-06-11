import React from 'react'
import styles from 'sass/components/table.module.scss'
import HEAD_LIST from 'lib/util/const'
import { useTable } from '..'

const {
  STATE, COMPONENT, FUNCTION, EDIT_TIME, ASSIGN, REMARK,
} = HEAD_LIST

export default function Cell({
  index,
  head,
  children,
}: {
  index: number
  head: string
  children: React.ReactNode
}) {
  const { table, currentArrange } = useTable()

  const getValue = (head: string, value: any) => {
    try {
      if (!value) {
        return null
      }
      switch (head) {
        case STATE:
          return value.name
        case EDIT_TIME:
          return null
        case ASSIGN:
          return value[0]?.name
        case FUNCTION:
          return null
        default:
          if (Array.isArray(value)) {
            if (value.length > 0) {
              return value[0]
            }
            return null
          }
          return value
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
    const currentValue = table[index][head]
    const curr = getValue(head, currentValue)
    if (!curr) {
      return false
    }
    const previousValue = table[index - 1][head]
    const prev = getValue(head, previousValue)
    if (prev === curr) {
      return true
    }
    return false
  }

  if (isSameWithPrevious()) {
    return <></>
  }

  const extendSpan = (i: number, acc: number) => {
    if (i < table.length - 1) {
      const currentValue = table[i][head]
      const nextValue = table[i + 1][head]
      const curr = getValue(head, currentValue)
      const next = getValue(head, nextValue)
      if (!curr || !next) {
        return acc
      }
      if (curr === next) {
        return extendSpan(i + 1, acc + 1)
      }
      return acc
    }
    return acc
  }

  const getBackgroundColor = () => {
    if (currentArrange.head !== STATE) {
      return null
    }
    const functional = [FUNCTION, REMARK]
    if (functional.includes(head)) {
      if (table[index][FUNCTION].checked) {
        return 'green'
      }
      return 'red'
    }
    if (head === COMPONENT) {
      const dependents = table
        .filter((row) => getValue(COMPONENT, row) === getValue(COMPONENT, table[index]))
      if (dependents.some((row) => row[FUNCTION].checked === false)) {
        return 'red'
      }
      return 'green'
    }
    return table[index][STATE].color
  }

  return (
    <td rowSpan={extendSpan(index, 1)} className={styles.cell}>
      <div className={styles.backgroundCell} style={{ backgroundColor: getBackgroundColor() }} />
      <div className={styles.cellWrapper}>
        {children}
      </div>
    </td>
  )
}
