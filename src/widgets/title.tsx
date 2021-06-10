import styles from 'sass/widgets/title.module.scss'

export default function Title() {
  return (
    <h1 className={styles.container}>
      <span>기능명세서</span>
      <span className={styles.with}>
        with
        <img src="/images/notion.png" alt="notion" />
      </span>
    </h1>
  )
}
