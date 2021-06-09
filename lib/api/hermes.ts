import { getCookie } from 'lib/util/cookie'

export default async function hermes(
  input: RequestInfo,
  init?: RequestInit,
) : Promise<Response> {
  const token = getCookie('token')
  if (!init) {
    return fetch(input)
  }
  const { headers, ...props } = init
  return fetch(input, {
    ...props,
    headers: {
      ...headers,
      Authorization: `Bearer ${token}`,
    },
  })
}
