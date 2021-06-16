/* eslint-disable no-param-reassign */
export function setCookie(name: string, value: any, ms?: number) : void {
  let expires = ''
  if (ms) {
    const date = new Date()
    date.setTime(date.getTime() + ms)
    expires = `; expires=${date.toUTCString()};`
  }
  document.cookie = `${name}=${escape(value) || ''}${expires} path=/`
}

export function getCookie(name : string) : string {
  const prefix = `${name}=`
  const division = document.cookie.split(';')
  for (let i = 0; i < division.length; i++) {
    const value = division[i]
    if (!value) {
      continue
    }
    if (value.indexOf(prefix) === 0) {
      return unescape(value.substring(prefix.length, value.length))
    }
  }
  return null
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=-99999999;`
}
