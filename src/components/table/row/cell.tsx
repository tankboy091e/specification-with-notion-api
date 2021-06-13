import React from 'react'
import styles from 'sass/components/table.module.scss'
import HEAD_LIST from 'lib/util/const'
import { useTable } from '..'

const {
  STATE, COMPONENT, FUNCTION, EDIT_TIME, ASSIGN, REMARK, ETC, ID,
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

  const getValue = (head: string, row: any) => {
    try {
      if (!row) {
        return null
      }
      const value = row[head]
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

  const getBackgroundColor = (head: string, index: number) => {
    if (currentArrange.head !== STATE) {
      return null
    }
    const dependedHead = [REMARK, ASSIGN, EDIT_TIME, ETC]
    if (dependedHead.includes(head)) {
      return getBackgroundColor(FUNCTION, index)
    }
    const functional = [FUNCTION, REMARK]
    if (functional.includes(head)) {
      if (table[index][FUNCTION].checked) {
        return 'green'
      }
      return table[index][STATE]?.color
    }
    if (head === COMPONENT) {
      const dependents = table
        .filter((row) => (
          getValue(COMPONENT, row) === getValue(COMPONENT, table[index])
          && getValue(ID, row) === getValue(ID, table[index])
        ))
      if (dependents.some((row) => row[FUNCTION].checked === false)) {
        return table[index][STATE]?.color
      }
      return 'green'
    }
    return table[index][STATE]?.color
  }

  const isSameWithPrevious = () => {
    if (index === 0) {
      return false
    }
    const currBackgroundColor = getBackgroundColor(head, index)
    const prevBackgroundColor = getBackgroundColor(head, index - 1)
    if (currBackgroundColor !== prevBackgroundColor) {
      return false
    }
    const curr = getValue(head, table[index])
    if (!curr) {
      return false
    }
    const prev = getValue(head, table[index - 1])
    if (prev === curr) {
      return true
    }
    return false
  }

  const extendSpan = (i: number, acc: number) => {
    if (i < table.length - 1) {
      const currBackgroundColor = getBackgroundColor(head, i)
      const nextBackgroundColor = getBackgroundColor(head, i + 1)
      if (currBackgroundColor !== nextBackgroundColor) {
        return acc
      }
      const curr = getValue(head, table[i])
      const next = getValue(head, table[i + 1])
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

  if (isSameWithPrevious()) {
    return <></>
  }

  return (
    <td
      rowSpan={extendSpan(index, 1)}
      className={styles.cell}
    >
      <div
        className={styles.backgroundCell}
        style={{ backgroundColor: getBackgroundColor(head, index) }}
      />
      <div className={styles.cellWrapper}>
        {children}
      </div>
    </td>
  )
}
