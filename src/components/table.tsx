import fetcher from 'lib/api/fetcher'
import styles from 'sass/components/table.module.scss'
import useSWR from 'swr'

export default function Table() {
  const { data, error } = useSWR('/api/table', fetcher)

  if (error) {
    <>something went wrong</>
  }

  if (!data) {
    return <>loading ...</>
  }

  console.log(data)

  return (
    <section className={styles.container}>
      <div />
    </section>
  )
}
