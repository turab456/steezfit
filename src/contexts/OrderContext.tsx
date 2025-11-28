import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type OrderAddress = {
  label: string
  recipient: string
  phone: string
  street: string
  city: string
  pin: string
  type: string
}

export type OrderItem = {
  id: string
  name: string
  quantity: number
  price: number
  image: string
  color?: string
  size?: string
}

export type Order = {
  id: string
  status: 'Processing' | 'Packed' | 'Shipped' | 'Delivered'
  placedAt: string
  paymentMethod: string
  subtotal: number
  shipping: number
  total: number
  address: OrderAddress
  items: OrderItem[]
  notes?: string
  expectedDelivery?: string
}

type CreateOrderInput = {
  items: OrderItem[]
  totals: {
    subtotal: number
    shipping: number
    total: number
  }
  address: OrderAddress
  paymentMethod?: string
  notes?: string
}

type OrderContextValue = {
  orders: Order[]
  createOrder: (input: CreateOrderInput) => Order
  findOrderById: (orderId: string) => Order | undefined
}

type OrderProviderProps = {
  children: ReactNode
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined)
const STORAGE_KEY = 'hod-orders'

function generateOrderId() {
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase()
  const timestamp = Date.now().toString(36).toUpperCase()
  return `ODR-${timestamp}-${randomPart}`
}

function safeParseOrders(rawValue: string | null): Order[] {
  if (!rawValue) return []
  try {
    const parsed = JSON.parse(rawValue)
    if (Array.isArray(parsed)) {
      return parsed
    }
    return []
  } catch {
    return []
  }
}

export function OrderProvider({ children }: OrderProviderProps) {
  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === 'undefined') return []
    return safeParseOrders(window.localStorage.getItem(STORAGE_KEY))
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
  }, [orders])

  const createOrder = (input: CreateOrderInput): Order => {
    const id = generateOrderId()
    const placedAt = new Date().toISOString()
    const expectedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString()

    const order: Order = {
      id,
      status: 'Processing',
      placedAt,
      expectedDelivery,
      paymentMethod: input.paymentMethod ?? 'Cash on delivery',
      subtotal: input.totals.subtotal,
      shipping: input.totals.shipping,
      total: input.totals.total,
      address: input.address,
      items: input.items,
      notes: input.notes,
    }

    setOrders((prev) => [order, ...prev])
    return order
  }

  const findOrderById = (orderId: string) => orders.find((order) => order.id === orderId)

  const value = useMemo(
    () => ({
      orders,
      createOrder,
      findOrderById,
    }),
    [orders],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}
