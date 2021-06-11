import styles from 'sass/widgets/title.module.scss'
import Link from 'next/link'

export default function Title() {
  return (
    <Link href="/">
      <a href="/">
        <h1 className={styles.container}>
          <span>Specification</span>
          <span className={styles.with}>
            with
            <img src="/images/notion.png" alt="notion" />
          </span>
        </h1>
      </a>
    </Link>
  )
}
