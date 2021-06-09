import Extension from 'components/extension'
import convertISODate from 'lib/util/date'
import styles from 'sass/components/table.module.scss'
import { useTable } from '.'

export default function Row({
  element,
}: {
  element: any
}) {
  const { keys } = useTable()

  const { id } = element

  const onDelete = async () => {
    alert('현재 노션은 삭제 API를 제공하지 않습니다.')
  }

  return (
    <tr className={styles.row}>
      {keys.map((key: any) => {
        const keyWithId = `${key}-${id}`
        const getValue = () => {
          if (key === '기타') {
            return (
              <Extension
                key={keyWithId}
                menu={[
                  {
                    child: '삭제',
                    onClick: onDelete,
                  },
                ]}
              />
            )
          }
          const { type, value } = element[key]
          if (key === '기능') {
            return (
              <>
                <input type="checkbox" value={element['완료'].value} disabled />
                <span>{value}</span>
              </>
            )
          }
          if (type === 'last_edited_time' || type === 'created_time') {
            const {
              year, month, date, hour, minute,
            } = convertISODate(value)
            return (
              <>
                <div>{`${year}년 ${month}월 ${date}일`}</div>
                <div>{`${hour}시 ${minute}분`}</div>
              </>
            )
          }
          if (Array.isArray(value)) {
            if (value.length > 0) {
              return value
            }
          } else if (value) {
            return value
          }
          return '-'
        }
        return (
          <td key={keyWithId} className={styles.cell}>
            {getValue()}
          </td>
        )
      })}
    </tr>
  )
}
