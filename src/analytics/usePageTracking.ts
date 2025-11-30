import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ensureGAStub, trackPageView } from './ga4'

const getPagePath = (pathname: string, search: string, hash: string) =>
  `${pathname}${search}${hash}`

export const usePageTracking = () => {
  const location = useLocation()

  useEffect(() => {
    ensureGAStub()
  }, [])

  useEffect(() => {
    const path = getPagePath(location.pathname, location.search, location.hash)
    const title = document?.title
    trackPageView(path, title)
  }, [location.hash, location.pathname, location.search])
}
