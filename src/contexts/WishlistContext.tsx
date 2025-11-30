import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { ProductDetail } from '../application/ProductDetails/types'
import WishlistApi from '../application/Wishlist/api/WishlistAPi'
import ProductDetailsApi from '../application/ProductDetails/api/ProductDetailsApi'
import { useAuth } from './AuthContext'
import { useAuthModal } from './AuthModalContext'

type WishlistContextValue = {
  itemIds: string[]
  items: ProductDetail[]
  isOpen: boolean
  count: number
  initialised: boolean
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
  const [wishlistIndex, setWishlistIndex] = useState<Record<string, number>>({})
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<ProductDetail[]>([])
  const [initialised, setInitialised] = useState(false)
  const { isAuthenticated } = useAuth()
  const { openAuthModal } = useAuthModal()

  const contains = useCallback((productId: string) => itemIds.includes(productId), [itemIds])

  useEffect(() => {
    let isCancelled = false
    const loadWishlist = async () => {
      if (!isAuthenticated) {
        setItemIds([])
        setItems([])
        setInitialised(true)
        return
      }
      try {
        const remoteItems = await WishlistApi.list()
        if (isCancelled) return
        setItemIds(remoteItems.map((item) => String(item.product.id)))
        setItems(remoteItems.map((item) => item.product))
        setWishlistIndex(
          remoteItems.reduce<Record<string, number>>((acc, item) => {
            acc[String(item.product.id)] = item.id
            return acc
          }, {}),
        )
      } catch (error) {
        console.error('Failed to load wishlist', error)
      } finally {
        if (!isCancelled) setInitialised(true)
      }
    }
    loadWishlist()
    return () => {
      isCancelled = true
    }
  }, [isAuthenticated])

  const syncWishlist = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        setItemIds([])
        setItems([])
        setWishlistIndex({})
        return
      }
      const remoteItems = await WishlistApi.list()
      setItemIds(remoteItems.map((item) => String(item.product.id)))
      setItems(remoteItems.map((item) => item.product))
      setWishlistIndex(
        remoteItems.reduce<Record<string, number>>((acc, item) => {
          acc[String(item.product.id)] = item.id
          return acc
        }, {}),
      )
    } catch (error) {
      console.error('Failed to sync wishlist', error)
    }
  }, [isAuthenticated])

  const addToWishlist = useCallback(
    (productId: string) => {
      if (contains(productId)) return

      const performAdd = async () => {
        try {
          const product = await ProductDetailsApi.getByIdOrSlug(productId)
          // Optimistically update UI
          setItemIds((prev) => (prev.includes(String(product.id)) ? prev : [...prev, String(product.id)]))
          setItems((prev) => {
            const alreadyThere = prev.some((item) => String(item.id) === String(product.id))
            return alreadyThere ? prev : [...prev, product]
          })

          const created = await WishlistApi.add(product.backendId ?? product.slug ?? product.id)
          if (created?.id) {
            setWishlistIndex((prev) => ({
              ...prev,
              [String(product.id)]: created.id,
            }))
          } else {
            void syncWishlist()
          }
        } catch (error) {
          console.error('Failed to add to wishlist', error)
          void syncWishlist()
        }
      }

      if (!isAuthenticated) {
        openAuthModal({ onLoginSuccess: () => void performAdd() })
        return
      }

      void performAdd()
    },
    [contains, isAuthenticated, openAuthModal, syncWishlist],
  )

  const removeFromWishlist = useCallback((productId: string) => {
    void (async () => {
      try {
        const wishlistId = wishlistIndex[productId]
        setItemIds((prev) => prev.filter((id) => id !== productId))
        setItems((prev) => prev.filter((item) => String(item.id) !== productId))
        setWishlistIndex((prev) => {
          const { [productId]: _removed, ...rest } = prev
          return rest
        })

        if (wishlistId) {
          await WishlistApi.remove(wishlistId)
        } else {
          const current = await WishlistApi.list()
          const match = current.find(
            (item) =>
              String(item.product.id) === productId || String(item.product.backendId ?? '') === productId,
          )
          if (match) {
            await WishlistApi.remove(match.id)
          }
        }
        await syncWishlist()
      } catch (error) {
        console.error('Failed to remove from wishlist', error)
      }
    })()
  }, [syncWishlist, wishlistIndex])

  const toggleWishlist = useCallback((productId: string) => {
    if (contains(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist(productId)
    }
  }, [addToWishlist, contains, removeFromWishlist])

  const openWishlist = useCallback(() => setIsOpen(true), [])
  const closeWishlist = useCallback(() => setIsOpen(false), [])

  return (
    <WishlistContext.Provider
      value={{
        itemIds,
        items,
        count: items.length,
        isOpen,
        initialised,
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
