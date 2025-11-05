import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'

type SmoothScrollProviderProps = {
  children: ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    })

    let animationFrameId = requestAnimationFrame(function frame(time: number) {
      lenis.raf(time)
      animationFrameId = requestAnimationFrame(frame)
    })

    return () => {
      cancelAnimationFrame(animationFrameId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
