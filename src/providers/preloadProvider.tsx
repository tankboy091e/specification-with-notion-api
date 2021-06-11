import React, {
  createContext, useContext, useState,
} from 'react'
import useSWR from 'swr'

interface PreloadContextProps {
  datas: { [key: string]: any }
  setUrl: (key: string, url: string) => void
}

const PreloadContext = createContext<PreloadContextProps>(null)

export const usePreload = () => useContext(PreloadContext)

export default function PreloadProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [urls, setUrls] = useState<{ key: string; url: string }[]>([])

  const [datas, setDatas] = useState<{ [key: string]: any }>()

  const preloadfetcher = async ({ key, url }) => {
    const res = await fetch(url)
    const data = await res.json()
    const newData = {}
    newData[key] = data
    setDatas({ ...datas, ...newData })
    return data
  }

  useSWR(urls, (...urls) => Promise.all(urls.map(preloadfetcher)))

  const setUrl = (key: string, url: string) => {
    setUrls([...urls, { key, url }])
  }

  const value = {
    setUrl,
    datas,
  }

  return (
    <PreloadContext.Provider value={value}>{children}</PreloadContext.Provider>
  )
}
