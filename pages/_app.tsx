import Preloader from 'components/preloader'
import { AppProps } from 'next/app'
import AuthProvider from 'providers/authProvider'
import PreloadProvider from 'providers/preloadProvider'
import 'sass/global.scss'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <PreloadProvider>
        <Preloader />
        <Component {...pageProps} />
      </PreloadProvider>
    </AuthProvider>
  )
}
