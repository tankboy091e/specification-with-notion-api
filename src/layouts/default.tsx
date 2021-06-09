import React from 'react'
import Head from 'next/head'
import { useAuth } from 'providers/authProvider'
import Login from 'templates/login'
import Navigation from 'components/navigation'

export default function Layout({
  children,
  Footer,
}: {
  children: React.ReactNode,
  Footer?: React.ReactNode,
}) {
  const { user } = useAuth()

  if (!user) {
    return <Login />
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <header>
        <Navigation />
      </header>
      <main>
        { children }
      </main>
      <footer>
        { Footer }
      </footer>
    </>
  )
}
