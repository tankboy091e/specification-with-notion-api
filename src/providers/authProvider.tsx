import hermes from 'lib/api/hermes'
import { deleteCookie, getCookie, setCookie } from 'lib/util/cookie'
import React, {
  createContext, useContext, useEffect, useState,
} from 'react'

type User = string
type State = 'default' | 'pending'

interface AuthProviderContextProps {
  user: User,
  signin: (password: string) => Promise<void>
  signout: () => Promise<void>
}

const AuthProviderContext = createContext<AuthProviderContextProps>(null)

export const useAuth = () => useContext(AuthProviderContext)

export default function AuthProvider({
  children,
} : {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User>(null)
  const [state, setState] = useState<State>('pending')

  const signin = async (password : string) : Promise<void> => {
    setState('pending')
    const res = await hermes('/api/auth', {
      body: JSON.stringify({
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    if (!res.ok) {
      alert('암호가 틀립니다')
      signout()
      return
    }
    const { data } = await res.json()
    const { name } = data
    setUser(name)
    setCookie('password', password, 60 * 60 * 1000)
    setState('default')
  }

  const signout = async () : Promise<void> => {
    setState('pending')
    deleteCookie('password')
    setUser(null)
    setState('default')
  }

  useEffect(() => {
    const password = getCookie('password')
    if (!password) {
      setState('default')
      return
    }
    signin(password)
  }, [])

  return (
    <AuthProviderContext.Provider value={{
      user,
      signin,
      signout,
    }}
    >
      {state === 'default' && children}
    </AuthProviderContext.Provider>
  )
}
