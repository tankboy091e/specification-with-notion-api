import { useEffect } from 'react'

export default function useResize(func: () => void) {
  useEffect(() => {
    window.addEventListener('resize', func)
    return () => window.removeEventListener('resize', func)
  }, [])
}
