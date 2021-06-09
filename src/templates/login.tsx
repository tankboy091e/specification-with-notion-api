import { useAuth } from 'providers/authProvider'
import { MouseEventHandler, useRef } from 'react'

export default function Login() {
  const { signin } = useAuth()
  const passwordRef = useRef<HTMLInputElement>()

  const onClick : MouseEventHandler = (e) => {
    e.preventDefault()
    signin(passwordRef.current.value)
  }

  return (
    <form>
      <input type="text" ref={passwordRef} autoComplete="off" />
      <input type="submit" value="로그인" onClick={onClick} />
    </form>
  )
}
