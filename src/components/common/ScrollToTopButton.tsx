'use client'

import { useEffect, useState } from 'react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-40 rounded-full bg-gray-900/90 p-3 text-white shadow-lg transition hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0 pointer-events-none'
      }`}
    >
      <ChevronUpIcon className="h-6 w-6" />
    </button>
  )
}

export default ScrollToTopButton

