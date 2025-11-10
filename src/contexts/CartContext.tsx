import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { ProductDetail } from '../data/catalog'

type CartItem = {
  id: string
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
  addToCart: (product: ProductDetail, options?: AddToCartOptions) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeFromCart: (itemId: string) => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

type CartProviderProps = {
  children: ReactNode
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2, 11)
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }, [items])

  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }, [items])

  const addToCart = (product: ProductDetail, options?: AddToCartOptions) => {
    const quantityToAdd = options?.quantity ?? 1
    const colorId = options?.colorId
    const sizeId = options?.sizeId

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColorId === colorId &&
          item.selectedSizeId === sizeId,
      )

      if (existingIndex !== -1) {
        const updated = [...prevItems]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantityToAdd,
        }
        return updated
      }

      return [
        ...prevItems,
        {
          id: createId(),
          product,
          quantity: quantityToAdd,
          selectedColorId: colorId,
          selectedSizeId: sizeId,
        },
      ]
    })
  }

  const removeFromCart = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(itemId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item)),
    )
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
      openCart,
      closeCart,
      toggleCart,
    }),
    [items, subtotal, totalItems, isOpen],
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
