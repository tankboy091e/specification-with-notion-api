import React from 'react'
import Head from 'next/head'
import { useAuth } from 'providers/authProvider'
import Login from 'templates/login'
import Navigation from 'components/navigation'
import styles from 'sass/layouts/default.module.scss'
import Footer from 'components/footer'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth()

  if (!user) {
    return (
      <>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <main className={styles.main}>
          <Login />
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <header className={styles.header}>
        <Navigation />
      </header>
      <main className={styles.main}>
        { children }
      </main>
      <Footer />
    </>
  )
}
