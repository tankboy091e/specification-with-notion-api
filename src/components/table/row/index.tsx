import Extension from 'components/extension'
import convertISODate from 'lib/util/date'
import styles from 'sass/components/table.module.scss'
import { FiExternalLink } from 'react-icons/fi'
import React from 'react'
import { useTable } from '..'
import Cell from './cell'

export default function Row({ index, element }: { index: number, element: any }) {
  const { keys, onCellClick } = useTable()

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
          const value = element[key]
          if (!value) {
            return null
          }
          switch (key) {
            case '상태':
              return <div>{value.name}</div>
            case '경로':
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
            case '아이디':
              return (
                <div className={styles.idWrapper}>
                  <a
                    className={styles.link}
                    href={`${process.env.NOTION_ORIGIN}${element['문서'][0]?.replace(
                      /-/g,
                      '',
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {value[0]}
                    <FiExternalLink className={styles.linkIcon} />
                  </a>
                </div>
              )
            case '기능':
              if (!value) {
                return null
              }
              return (
                <div className={styles.function}>
                  <input type="checkbox" checked={value.checked} disabled />
                  <span>{value.content}</span>
                </div>
              )
            case '배정':
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
            case '최종편집일시':
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
            default:
              if (Array.isArray(value)) {
                if (value.length > 0) {
                  if (!value[0]) {
                    return null
                  }
                  return value
                }
              }
              return value
          }
        }
        const interactiveKeys = ['경로', '아이디', '컴포넌트']
        if (interactiveKeys.includes(key)) {
          return (
            <Cell key={keyWithId} index={index} category={key}>
              <button
                className={styles.cellButton}
                type="button"
                onClick={() => onCellClick(key, element[key])}
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
