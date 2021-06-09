import styles from 'sass/widgets/loading.module.scss'
import { AiOutlineLoading } from 'react-icons/ai'

export default function Loading({
  size = 48,
}: {
  size? : number
}) {
  return (
    <section className={styles.container}>
      <AiOutlineLoading className={styles.spinner} size={size} />
    </section>
  )
}
