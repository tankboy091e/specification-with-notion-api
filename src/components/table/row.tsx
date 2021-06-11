import Extension from 'components/extension'
import convertISODate from 'lib/util/date'
import styles from 'sass/components/table.module.scss'
import { FiExternalLink } from 'react-icons/fi'
import React from 'react'
import { useTable } from '.'

export default function Row({ index, element }: { index: number, element: any }) {
  const { keys, onTableHeadClick } = useTable()

  const { id } = element

  const onDelete = async () => {
    alert('현재 노션은 삭제 API를 제공하지 않습니다. 노션 페이지에서 삭제해주세요.')
  }

  return (
    <tr className={styles.row}>
      {keys.map((key: any) => {
        const keyWithId = `${key}-${id}`
        const getValue = () => {
          if (key === '기타') {
            return (
              <Extension
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
          if (key === '배정') {
            if (value.length === 0) {
              return null
            }
            return (
              <div className={styles.frameWrapper}>
                {value.map(({ name, avatar_url: url }) => (
                  <figure key={Math.random()} className={styles.frame}>
                    {/* <img className={styles.face} src={url} alt="" /> */}
                    <figcaption className={styles.name}>{name}</figcaption>
                  </figure>
                ))}
              </div>
            )
          }
          if (key === '문서') {
            return (
              <a
                className={styles.link}
                href={`${process.env.NOTION_ORIGIN}${value[0]?.replace(
                  /-/g,
                  '',
                )}`}
                target="_blank"
                rel="noreferrer"
              >
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
            return (
              <a
                className={styles.route}
                href={`${process.env.ORIGIN}${value}`}
                target="_blank"
                rel="noreferrer"
              >
                {value}
              </a>
            )
          }
          if (type === 'last_edited_time' || type === 'created_time') {
            const {
              year, month, date, hour, minute,
            } = convertISODate(value)
            return (
              <>
                {`${year}년 ${month}월 ${date}일`}
                <br />
                {`${hour}시 ${minute}분`}
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
        const interactiveKeys = ['경로', '아이디', '컴포넌트']
        if (interactiveKeys.includes(key)) {
          return (
            <Cell key={keyWithId} index={index} category={key}>
              <button
                className={styles.cellButton}
                type="button"
                onClick={() => onTableHeadClick(key, element[key]?.value)}
              >
                {getValue() || '-'}
              </button>
            </Cell>
          )
        }
        return (
          <Cell key={keyWithId} index={index} category={key}>
            {getValue() || '-'}
          </Cell>
        )
      })}
    </tr>
  )
}

function Cell({
  index,
  category: key,
  children,
} : {
  index: number,
  category: string,
  children: React.ReactNode
}) {
  const { table } = useTable()

  const getValueByKey = (key: string, element: any) => {
    if (!element) {
      return null
    }
    switch (key) {
      case '상태':
        return element.value.name
      case '최종편집일시':
        return null
      case '배정':
        return element.value[0]?.name
      case '기능':
        return null
      default:
        if (Array.isArray(element.value)) {
          if (element.value.length > 0) {
            return element.value[0]
          }
          return null
        }
        return element.value
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

  return (
    <td
      rowSpan={rowspan}
      className={styles.cell}
    >
      {children}
    </td>
  )
}
