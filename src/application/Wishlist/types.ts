import type { ProductDetail } from '../ProductDetails/types'

export type WishlistItemResponse = {
  id: number
  userId: number
  productId: number
}

export type WishlistListResponse = {
  success: boolean
  message?: string
  data: Array<
    WishlistItemResponse & {
      product?: {
        id: number
        slug?: string
      }
    }
  >
}

export type WishlistItem = WishlistItemResponse & {
  product: ProductDetail
}
