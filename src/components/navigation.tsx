import { useAuth } from 'providers/authProvider'
import Title from 'widgets/title'
import styles from 'sass/components/navigation.module.scss'
import { FiLogOut } from 'react-icons/fi'

export default function Navigation() {
  const { user, signout } = useAuth()

  return (
    <section className={styles.container}>
      <div className={styles.wrapper}>
        <Title />
        <span className={styles.hello}>
          안녕하세요
          <span className={styles.name}>
            {` ${user}`}
          </span>
          님
        </span>
      </div>
      <button className={styles.signout} type="button" onClick={signout}>
        <FiLogOut size="1.4rem" />
      </button>
    </section>
  )
}
