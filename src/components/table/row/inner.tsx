import Extension from 'components/extension'
import convertISODate from 'lib/util/date'
import styles from 'sass/components/table.module.scss'
import { FiExternalLink } from 'react-icons/fi'
import React, { SetStateAction } from 'react'
import HEAD_LIST from 'lib/util/const'
import Cell from './cell'
import { RowData, State } from '.'
import { useTable } from '..'

const {
  STATE, ROUTE, ID, COMPONENT, FUNCTION, EDIT_TIME, ASSIGN, ETC, DOC,
} = HEAD_LIST

export default function RowInner({
  index,
  data,
  setState,
}: {
  index: number
  data: RowData
  setState: React.Dispatch<SetStateAction<State>>
}) {
  const { id } = data

  const { heads, setDefaultInputData } = useTable()

  const interactiveKeys = [ROUTE, ID, COMPONENT]

  const onClick = (head: string, content: string) => {
    const newData = {}
    newData[head] = content
    setDefaultInputData((inputdata) => ({
      ...inputdata,
      ...newData,
    }))
  }

  const onDelete = async () => {
    alert('현재 노션은 삭제 API를 제공하지 않습니다. 노션 페이지에서 삭제해주세요.')
  }

  const onEdit = async () => {
    setState('edit')
  }

  const getEtc = () => (
    <Extension
      menu={[
        {
          child: '수정',
          onClick: onEdit,
        },
        {
          child: '삭제',
          onClick: onDelete,
        },
      ]}
    />
  )

  const getState = (value: any) => {
    const { name } = value
    return <div>{name}</div>
  }

  const getRoute = (value: any) => (
    <a
      className={styles.route}
      href={`${process.env.ORIGIN}${value}`}
      target="_blank"
      rel="noreferrer"
    >
      {value}
    </a>
  )

  const getId = (value: any) => (
    <div className={styles.idWrapper}>
      <a
        className={styles.link}
        href={`${process.env.NOTION_ORIGIN}${data[DOC][0]?.replace(
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

  const getFunction = (value: any) => {
    if (!value) {
      return null
    }
    return (
      <div className={styles.function}>
        <input type="checkbox" checked={value.checked} disabled />
        <span>{value.content}</span>
      </div>
    )
  }

  const getAssign = (value: any) => {
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

  const getEditTime = (value: any) => {
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

  const getDefaultValue = (value: any) => {
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

  const getValue = (head: string) => {
    if (head === ETC) {
      return getEtc()
    }
    const value = data[head]
    if (!value) {
      return null
    }
    switch (head) {
      case STATE:
        return getState(value)
      case ROUTE:
        return getRoute(value)
      case ID:
        return getId(value)
      case FUNCTION:
        return getFunction(value)
      case ASSIGN:
        return getAssign(value)
      case EDIT_TIME:
        return getEditTime(value)
      default:
        return getDefaultValue(value)
    }
  }

  return (
    <tr className={styles.row}>
      {heads.map((head: any) => {
        const keyWithId = `${head}-${id}`
        return (
          <Cell key={keyWithId} index={index} head={head}>
            {interactiveKeys.includes(head)
              ? (
                <button
                  className={styles.cellButton}
                  type="button"
                  onClick={() => onClick(head, data[head])}
                >
                  {getValue(head) || '-'}
                </button>
              )
              : getValue(head) || '-'}
          </Cell>
        )
      })}
    </tr>
  )
}
