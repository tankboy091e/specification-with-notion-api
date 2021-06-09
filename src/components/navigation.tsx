import { useAuth } from 'providers/authProvider'
import Title from 'widgets/title'
import styles from 'sass/components/navigation.module.scss'

export default function Navigation() {
  const { user, signout } = useAuth()

  return (
    <section className={styles.container}>
      <div className={styles.titleWrapper}>
        <Title />
        <span className={styles.hello}>
          안녕하세요
          <span className={styles.name}>
            {` ${user}`}
          </span>
          님
        </span>
      </div>
      <button type="button" onClick={signout}>
        로그아웃
      </button>
    </section>
  )
}
