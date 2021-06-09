import { cn } from 'lib/util'
import React, { MouseEventHandler, useState } from 'react'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import styles from 'sass/components/extension.module.scss'

interface Menu {
  child: React.ReactNode
  onClick: MouseEventHandler
}

export default function Extension({
  containerClassName,
  menuButtonClassName,
  popupClassName,
  buttonWrapperClassName,
  menuButtonSize = 16,
  menu,
}: {
  containerClassName?: string
  menuButtonClassName?: string
  popupClassName?: string
  buttonWrapperClassName?: string
  menuButtonSize?: number
  menu: Menu[]
}) {
  const [active, setActive] = useState(false)

  return (
    <section className={cn(styles.container, containerClassName)}>
      <button
        type="button"
        className={cn(styles.menuButton, menuButtonClassName)}
        onClick={() => setActive(!active)}
      >
        <HiOutlineDotsVertical size={menuButtonSize} />
      </button>
      {active && (
        <section className={cn(styles.popup, popupClassName)}>
          {menu.map(({ child, onClick }) => (
            <div
              key={child.toString()}
              className={cn(styles.buttonWrapper, buttonWrapperClassName)}
            >
              <button type="button" onClick={onClick}>
                {child}
              </button>
            </div>
          ))}
        </section>
      )}
    </section>
  )
}
