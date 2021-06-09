import axios from 'axios'

export default async function fetcher(url: string, token: string) {
  return axios
    .get(url, { headers: { Authorization: `Bearer ${token}` } })
    .then((res) => res.data)
}
