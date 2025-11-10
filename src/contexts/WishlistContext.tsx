import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ProductDetail } from '../data/catalog'
import { getProductById } from '../data/catalog'

type WishlistContextValue = {
  itemIds: string[]
  items: ProductDetail[]
  isOpen: boolean
  count: number
  contains: (productId: string) => boolean
  addToWishlist: (productId: string) => void
  removeFromWishlist: (productId: string) => void
  toggleWishlist: (productId: string) => void
  openWishlist: () => void
  closeWishlist: () => void
}

type WishlistProviderProps = {
  children: ReactNode
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [itemIds, setItemIds] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const contains = useCallback((productId: string) => itemIds.includes(productId), [itemIds])

  const addToWishlist = useCallback((productId: string) => {
    setItemIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]))
  }, [])

  const removeFromWishlist = useCallback((productId: string) => {
    setItemIds((prev) => prev.filter((id) => id !== productId))
  }, [])

  const toggleWishlist = useCallback((productId: string) => {
    setItemIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      }
      return [...prev, productId]
    })
  }, [])

  const items = useMemo(() => {
    return itemIds
      .map((id) => getProductById(id))
      .filter((product): product is ProductDetail => Boolean(product))
  }, [itemIds])

  const openWishlist = useCallback(() => setIsOpen(true), [])
  const closeWishlist = useCallback(() => setIsOpen(false), [])

  return (
    <WishlistContext.Provider
      value={{
        itemIds,
        items,
        count: items.length,
        isOpen,
        contains,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        openWishlist,
        closeWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
