import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import Lenis from 'lenis'

type SmoothScrollProviderProps = {
  children: ReactNode
}

type LenisContextValue = Lenis | null

const LenisContext = createContext<LenisContextValue>(null)

export function useLenisInstance() {
  return useContext(LenisContext)
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    })

    setLenisInstance(lenis)

    let animationFrameId = requestAnimationFrame(function frame(time: number) {
      lenis.raf(time)
      animationFrameId = requestAnimationFrame(frame)
    })

    return () => {
      cancelAnimationFrame(animationFrameId)
      lenis.destroy()
      setLenisInstance(null)
    }
  }, [])

  return <LenisContext.Provider value={lenisInstance}>{children}</LenisContext.Provider>
}
