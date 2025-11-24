import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import AuthModal from '../components/common/AuthModal'

type AuthModalView = 'request-otp' | 'verify-otp' | 'complete-profile'

type AuthModalContextValue = {
  openAuthModal: (options?: { view?: AuthModalView; onLoginSuccess?: () => void }) => void
  closeAuthModal: () => void
}

const AuthModalContext = createContext<AuthModalContextValue | undefined>(undefined)

export const AuthModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [initialView, setInitialView] = useState<AuthModalView>('request-otp')
  const onSuccessRef = useRef<(() => void) | null>(null)

  const closeAuthModal = useCallback(() => {
    setIsOpen(false)
    onSuccessRef.current = null
  }, [])

  const handleLoginSuccess = useCallback(() => {
    const callback = onSuccessRef.current
    closeAuthModal()
    if (callback) {
      callback()
      onSuccessRef.current = null
    }
  }, [closeAuthModal])

  const openAuthModal = useCallback(
    (options?: { view?: AuthModalView; onLoginSuccess?: () => void }) => {
      setInitialView(options?.view ?? 'request-otp')
      onSuccessRef.current = options?.onLoginSuccess ?? null
      setIsOpen(true)
    },
    [],
  )

  const value = useMemo(
    () => ({
      openAuthModal,
      closeAuthModal,
    }),
    [closeAuthModal, openAuthModal],
  )

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <AuthModal
        isOpen={isOpen}
        onClose={closeAuthModal}
        onLoginSuccess={handleLoginSuccess}
        initialView={initialView}
      />
    </AuthModalContext.Provider>
  )
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext)
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider')
  }
  return context
}
