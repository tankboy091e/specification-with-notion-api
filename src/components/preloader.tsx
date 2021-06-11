import fetcher from 'lib/api/fetcher'
import useSWR from 'swr'

export default function Preloader() {
  useSWR('/api/table', fetcher)
  return <></>
}
