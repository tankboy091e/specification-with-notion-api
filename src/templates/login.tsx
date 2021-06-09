import { useAuth } from 'providers/authProvider'
import { FormEventHandler, useRef } from 'react'
import styles from 'sass/templates/login.module.scss'

export default function Login() {
  const { signin } = useAuth()
  const passwordRef = useRef<HTMLInputElement>()

  const onSubmit : FormEventHandler = (e) => {
    e.preventDefault()
    signin(passwordRef.current.value)
  }

  return (
    <form className={styles.container} onSubmit={onSubmit}>
      <fieldset className={styles.inner}>
        <legend className={styles.legend}>암호를 대세요</legend>
        <input className={styles.password} type="text" ref={passwordRef} autoComplete="off" />
        <input className={styles.submit} type="submit" value="로그인" />
      </fieldset>
    </form>
  )
}
