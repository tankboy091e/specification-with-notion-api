import { AppProps } from 'next/app'
import AuthProvider from 'providers/authProvider'
import 'sass/global.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}
