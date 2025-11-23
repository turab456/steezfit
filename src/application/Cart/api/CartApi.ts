import apiClient from '../../../services/ApiClient'
import ProductDetailsApi from '../../ProductDetails/api/ProductDetailsApi'
import type { CartItem, CartItemResponse, CartListResponse } from '../types'

const unwrap = <T>(response: { success: boolean; message?: string; data: T }): T => {
  if (!response.success) {
    throw new Error(response.message || 'Cart request failed')
  }
  return response.data
}

const mapItem = async (raw: CartItemResponse & { product?: { id: number; slug?: string } }): Promise<CartItem> => {
  const productId = raw.product?.slug || raw.product?.id || raw.productId
  const product = await ProductDetailsApi.getByIdOrSlug(String(productId))
  return {
    id: raw.id,
    product,
    quantity: raw.quantity,
    selectedColorId: raw.colorId ? String(raw.colorId) : undefined,
    selectedSizeId: raw.sizeId ? String(raw.sizeId) : undefined,
  }
}

const CartApi = {
  async list(): Promise<CartItem[]> {
    const response = (await apiClient.get('/user/cart')) as CartListResponse
    const data = unwrap(response)
    const items = await Promise.all(
      data.map((item) =>
        mapItem({
          id: item.id,
          productId: item.productId,
          userId: item.userId,
          quantity: item.quantity,
          colorId: item.colorId,
          sizeId: item.sizeId,
          product: item.product,
        }),
      ),
    )
    return items
  },

  async add(options: { productId: string | number; quantity?: number; colorId?: string | number; sizeId?: string | number }) {
    await apiClient.post('/user/cart', {
      productId: options.productId,
      quantity: options.quantity ?? 1,
      colorId: options.colorId ?? null,
      sizeId: options.sizeId ?? null,
    })
  },

  async update(id: number, quantity: number) {
    await apiClient.put(`/user/cart/${id}`, { quantity })
  },

  async remove(id: number) {
    await apiClient.delete(`/user/cart/${id}`)
  },

  async clear() {
    await apiClient.delete('/user/cart')
  },
}

export default CartApi
