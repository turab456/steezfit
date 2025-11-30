import apiClient from '../../../services/ApiClient'
import ProductDetailsApi from '../../ProductDetails/api/ProductDetailsApi'
import type { WishlistItem, WishlistListResponse } from '../types'

const unwrap = <T>(response: { success: boolean; message?: string; data: T }): T => {
  if (!response.success) {
    throw new Error(response.message || 'Wishlist request failed')
  }
  return response.data
}

async function buildItem(
  raw: WishlistListResponse['data'][number],
): Promise<WishlistItem | null> {
  const productId = raw.product?.slug || raw.product?.id || raw.productId
  if (!productId) return null
  const product = await ProductDetailsApi.getByIdOrSlug(String(productId))
  return {
    id: raw.id,
    userId: raw.userId,
    productId: raw.productId,
    product,
  }
}

const unwrapOrData = <T = any>(response: any): T => {
  if (response?.success === false) {
    throw new Error(response?.message || 'Wishlist request failed')
  }
  return (response?.data as T) ?? (response as T)
}

const WishlistApi = {
  async list(): Promise<WishlistItem[]> {
    const response = (await apiClient.get('/user/wishlist')) as WishlistListResponse
    const data = unwrap(response)
    const items = await Promise.all(data.map(buildItem))
    return items.filter((item): item is WishlistItem => Boolean(item))
  },

  async add(productId: string | number) {
    const response = await apiClient.post('/user/wishlist', { productId })
    const data = unwrapOrData<any>(response)
    if (data && typeof data === 'object') {
      const id = Number((data as any).id)
      const userId = Number((data as any).userId ?? 0)
      const createdProductId = Number((data as any).productId ?? productId)
      if (!Number.isNaN(id)) {
        return { id, userId, productId: createdProductId }
      }
    }
    return null
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/user/wishlist/${id}`)
  },
}

export default WishlistApi
