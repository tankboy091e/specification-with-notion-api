import { useTable } from '..'
import InputRow from '../row/input'

export default function TableInput() {
  const { inputs, defaultInputData } = useTable()
  return (
    <>
      {inputs.map((head) => (
        <InputRow key={head} index={head} data={defaultInputData} />
      ))}
    </>
  )
}
