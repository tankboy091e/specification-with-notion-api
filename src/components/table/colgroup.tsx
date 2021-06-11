import HEAD_LIST from 'lib/util/const'
import { useTable } from '.'

const {
  ROUTE, ID, COMPONENT, FUNCTION, REMARK, ASSIGN, EDIT_TIME,
} = HEAD_LIST

export default function Colgroup() {
  const { heads } = useTable()

  const ratios : number[] = heads.map((head: string) => {
    switch (head) {
      case FUNCTION:
        return 5
      case REMARK:
        return 2.5
      case COMPONENT:
        return 2.5
      case EDIT_TIME:
        return 2
      case ROUTE:
        return 2
      case ID:
        return 2
      case ASSIGN:
        return 1.5
      default:
        return 1
    }
  })

  const total = ratios.reduce((acc, cur) => (
    acc + cur
  ), 0)

  return (
    <colgroup>
      {ratios.map((ratio, index) => (
        <col
          key={heads[index]}
          width={`${Math.floor((ratio / total) * 100)}%`}
        />
      ))}
    </colgroup>
  )
}
