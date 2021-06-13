import styles from 'sass/components/footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.container}>
      <p className={styles.copyright}>
        ⓒ 2021. 오진수 all rights reserved.
      </p>
    </footer>
  )
}
