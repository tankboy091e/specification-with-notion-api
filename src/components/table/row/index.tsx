import React, { useEffect, useState } from 'react'
import { useTable } from '..'
import InputRow from './input'
import RowInner from './inner'

export type State = 'default' | 'edit'

export interface RowData {
  [key: string]: any
}

export default function Row({ index, data }: { index: number, data: RowData }) {
  const [state, setState] = useState<State>('default')

  const { currentArrange } = useTable()

  useEffect(() => {
    setState('default')
  }, [currentArrange])

  if (state === 'edit') {
    return (
      <InputRow index={null} data={data} edit />
    )
  }

  return (
    <RowInner index={index} data={data} setState={setState} />
  )
}
