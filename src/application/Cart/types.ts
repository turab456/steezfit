import type { ProductDetail } from '../ProductDetails/types'

export type CartItemResponse = {
  id: number
  userId: number
  productId: number
  quantity: number
  colorId: number | null
  sizeId: number | null
}

export type CartListResponse = {
  success: boolean
  message?: string
  data: Array<
    CartItemResponse & {
      product?: {
        id: number
        slug?: string
      }
      color?: { id: number } | null
      size?: { id: number } | null
    }
  >
}

export type CartItem = {
  id: number
  product: ProductDetail
  quantity: number
  selectedColorId?: string
  selectedSizeId?: string
}
