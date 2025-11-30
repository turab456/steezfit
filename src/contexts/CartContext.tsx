import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ProductDetail } from '../application/ProductDetails/types'
import CartApi from '../application/Cart/api/CartApi'
import { useAuth } from './AuthContext'
import { useAuthModal } from './AuthModalContext'
import { trackAddToCart } from '../analytics/ga4'
import { toGAProductFromDetail } from '../analytics/productMapper'

type CartItem = {
  id: number
  product: ProductDetail
  quantity: number
  selectedColorId?: string
  selectedSizeId?: string
}

type AddToCartOptions = {
  colorId?: string
  sizeId?: string
  quantity?: number
}

type CartContextValue = {
  items: CartItem[]
  totalItems: number
  subtotal: number
  isOpen: boolean
  initialised: boolean
  addToCart: (product: ProductDetail, options?: AddToCartOptions) => boolean
  updateQuantity: (itemId: number, quantity: number) => void
  removeFromCart: (itemId: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

type CartProviderProps = {
  children: ReactNode
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [initialised, setInitialised] = useState(false)
  const { isAuthenticated } = useAuth()
  const { openAuthModal } = useAuthModal()

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }, [items])

  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [items])

  useEffect(() => {
    let isCancelled = false
    const loadCart = async () => {
      if (!isAuthenticated) {
        setItems([])
        setInitialised(true)
        return
      }
      try {
        const remoteItems = await CartApi.list()
        if (!isCancelled) {
          setItems(remoteItems)
        }
      } catch (error) {
        console.error('Failed to load cart', error)
      } finally {
        if (!isCancelled) {
          setInitialised(true)
        }
      }
    }
    loadCart()
    return () => {
      isCancelled = true
    }
  }, [isAuthenticated])

  const syncCart = async () => {
    try {
      if (!isAuthenticated) {
        setItems([])
        return
      }
      const remoteItems = await CartApi.list()
      setItems(remoteItems)
    } catch (error) {
      console.error('Failed to sync cart', error)
    }
  }

  const addToCart = (product: ProductDetail, options?: AddToCartOptions) => {
    if (product.isActive === false) {
      console.warn('Attempted to add inactive product to cart.')
      return false
    }
    const quantityToAdd = options?.quantity ?? 1
    const colorId = options?.colorId
    const sizeId = options?.sizeId

    const upsertByVariant = (nextItem: CartItem, mode: 'increment' | 'replace') =>
      setItems((prev) => {
        const matchIndex = prev.findIndex(
          (entry) =>
            String(entry.product.id) === String(nextItem.product.id) &&
            String(entry.selectedColorId ?? '') === String(nextItem.selectedColorId ?? '') &&
            String(entry.selectedSizeId ?? '') === String(nextItem.selectedSizeId ?? ''),
        )

        if (matchIndex >= 0) {
          const updated = [...prev]
          const existing = updated[matchIndex]
          updated[matchIndex] = {
            ...existing,
            ...nextItem,
            id: nextItem.id > 0 ? nextItem.id : existing.id,
            quantity:
              mode === 'increment'
                ? existing.quantity + nextItem.quantity
                : nextItem.quantity ?? existing.quantity,
          }
          return updated
        }

        return [...prev, nextItem]
      })

    const performAdd = () => {
      void (async () => {
        try {
          // Optimistically bump quantity if this variant is already in cart
          upsertByVariant({
            id: -Date.now(),
            product,
            quantity: quantityToAdd,
            selectedColorId: colorId,
            selectedSizeId: sizeId,
          }, 'increment')

          const created = await CartApi.add({
            productId: product.backendId ?? product.slug ?? product.id,
            quantity: quantityToAdd,
            colorId,
            sizeId,
          })

          if (created) {
            upsertByVariant(created, 'replace')
          } else {
            await syncCart()
          }
          trackAddToCart(toGAProductFromDetail(product, colorId, sizeId), quantityToAdd)
        } catch (error) {
          console.error('Failed to add to cart', error)
          void syncCart()
        }
      })()
    }

    if (!isAuthenticated) {
      openAuthModal({ onLoginSuccess: performAdd })
      return false
    }

    performAdd()
    return true
  }

  const removeFromCart = (itemId: number) => {
    void (async () => {
      try {
        await CartApi.remove(itemId)
        await syncCart()
      } catch (error) {
        console.error('Failed to remove from cart', error)
      }
    })()
  }

  const clearCart = () => {
    void (async () => {
      try {
        await CartApi.clear()
        await syncCart()
      } catch (error) {
        console.error('Failed to clear cart', error)
      }
    })()
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    void (async () => {
      try {
        if (quantity < 1) {
          await CartApi.remove(itemId)
        } else {
          await CartApi.update(itemId, quantity)
        }
        await syncCart()
      } catch (error) {
        console.error('Failed to update quantity', error)
      }
    })()
  }

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)
  const toggleCart = () => setIsOpen((prev) => !prev)

  const contextValue = useMemo(
    () => ({
      items,
      subtotal,
      totalItems,
      isOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
      initialised,
    }),
    [
      addToCart,
      clearCart,
      closeCart,
      initialised,
      isOpen,
      items,
      openCart,
      removeFromCart,
      subtotal,
      toggleCart,
      totalItems,
      updateQuantity,
    ],
  )

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
