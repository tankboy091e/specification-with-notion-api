import hermes from 'lib/api/hermes'
import HEAD_LIST from 'lib/util/const'
import React, { FormEvent } from 'react'
import styles from 'sass/components/table.module.scss'
import { useTable } from '.'

const {
  ID, COMPONENT, FUNCTION,
} = HEAD_LIST

export default function TableForm({
  children,
}: {
  children: React.ReactNode
}) {
  const { setState } = useTable()

  const getInputRows = (e: FormEvent<HTMLFormElement>) => {
    const result: Element[] = []
    e.currentTarget
      .querySelectorAll('.inputRow')
      .forEach((element) => {
        result.push(element)
      })
    return result
  }

  const getEachPayload = (element: Element) => {
    const data = {
      id: element.id,
    }

    for (const textarea of element.querySelectorAll('textarea').values()) {
      const name = textarea.getAttribute('name')
      const { value } = textarea
      data[name] = value
    }

    return data
  }

  const isValidated = (payload: any[]) => {
    const validations = [ID, COMPONENT, FUNCTION]

    for (const data of payload) {
      for (const validation of validations) {
        if (!data[validation]) {
          return false
        }
      }
    }

    return true
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setState('pending')

    const inputRows = getInputRows(e)

    const payload = inputRows.map(getEachPayload)

    if (!isValidated(payload)) {
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

    if (res.ok) {
      const { message } = await res.json()
      alert(message)
      setState('complete')
    } else {
      const { error } = await res.json()
      alert(error)
      setState('default')
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
    </form>
  )
}
