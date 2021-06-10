import Extension from 'components/extension'
import convertISODate from 'lib/util/date'
import styles from 'sass/components/table.module.scss'
import { FiExternalLink } from 'react-icons/fi'
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
          if (key === '상태') {
            if (!value) {
              return null
            }
            const { name } = value
            return <div>{name}</div>
          }
          if (key === '문서') {
            return (
              <a className={styles.link} href={`${process.env.NOTION_ORIGIN}${value[0]?.replace(/-/g, '')}`} target="_blank" rel="noreferrer">
                <FiExternalLink />
              </a>
            )
          }
          if (key === '기능') {
            if (!value) {
              return null
            }
            const { content, checked } = value
            return (
              <div className={styles.function}>
                <input type="checkbox" checked={checked} disabled />
                <span>{content}</span>
              </div>
            )
          }
          if (key === '경로') {
            return <a className={styles.route} href={`${process.env.ORIGIN}${value}`} target="_blank" rel="noreferrer">{value}</a>
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
              if (!value[0]) {
                return null
              }
              return value
            }
          } else if (value) {
            return value
          }
          return null
        }
        console.log(getValue())
        return (
          <td key={keyWithId} className={styles.cell}>
            {getValue() || '-'}
          </td>
        )
      })}
    </tr>
  )
}