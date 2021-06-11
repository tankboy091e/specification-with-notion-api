import Preloader from 'components/preloader'
import { AppProps } from 'next/app'
import AuthProvider from 'providers/authProvider'
import PreloadProvider from 'providers/preloadProvider'
import Head from 'next/head'
import 'sass/global.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>기능명세서</title>
      </Head>
      <AuthProvider>
        <PreloadProvider>
          <Preloader />
          <Component {...pageProps} />
        </PreloadProvider>
      </AuthProvider>
    </>
  )
}
