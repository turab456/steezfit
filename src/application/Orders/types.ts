export type OrderStatus =
  | 'PLACED'
  | 'CONFIRMED'
  | 'PACKED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURN_REQUESTED'
  | 'RETURNED'

export type PaymentMethod = 'COD'
export type PaymentStatus = 'pending' | 'paid' | 'cancelled'

export type OrderItem = {
  id: number
  productId: number
  productName: string
  productSlug?: string | null
  variantId?: number | null
  colorId?: number | null
  sizeId?: number | null
  colorName?: string | null
  sizeName?: string | null
  sku?: string | null
  quantity: number
  unitPrice: number
  totalPrice: number
  imageUrl?: string | null
}

export type Order = {
  id: string
  userId: string
  assignedPartnerId?: string | null
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  subtotal: number
  shippingFee: number
  discountAmount?: number
  couponCode?: string | null
  total: number
  addressName: string
  addressPhone?: string | null
  addressLine1: string
  addressLine2?: string | null
  city: string
  state: string
  postalCode?: string | null
  items: OrderItem[]
  createdAt?: string
  updatedAt?: string
}

export type ShippingSetting = {
  freeShippingThreshold: number
  shippingFee: number
  isActive?: boolean
}

export type ApiResponse<T> = {
  success: boolean
  message?: string
  data: T
}
