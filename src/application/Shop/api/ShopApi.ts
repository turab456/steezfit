import apiClient from '../../../services/ApiClient'
import type { ShopApiResponse, ShopProduct, ShopProductFilters, ShopVariantCard } from '../types'

const unwrap = <T>(response: ShopApiResponse<T>): T => {
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch products.')
  }
  return response.data
}

const buildQueryString = (filters: ShopProductFilters = {}): string => {
  const params = new URLSearchParams()

  if (filters.categoryId) params.set('categoryId', String(filters.categoryId))
  if (filters.collectionId) params.set('collectionId', String(filters.collectionId))
  if (filters.colorId) params.set('colorId', String(filters.colorId))
  if (filters.sizeId) params.set('sizeId', String(filters.sizeId))
  if (filters.colorIds && filters.colorIds.length) {
    filters.colorIds.forEach((id) => params.append('colorId', String(id)))
  }
  if (filters.sizeIds && filters.sizeIds.length) {
    filters.sizeIds.forEach((id) => params.append('sizeId', String(id)))
  }
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))

  if (filters.sort && filters.sort !== 'newest') {
    params.set('sort', filters.sort)
  }

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

const ShopApi = {
  async listProducts(filters?: ShopProductFilters): Promise<ShopProduct[]> {
    const query = buildQueryString(filters)
    const response = (await apiClient.get(`/products${query}`)) as ShopApiResponse<ShopProduct[]>
    return unwrap(response)
  },

  async listVariantCards(filters?: ShopProductFilters): Promise<ShopVariantCard[]> {
    const query = buildQueryString(filters)
    const prefix = query ? '&' : '?'
    const response = (await apiClient.get(
      `/products${query}${prefix}listByVariant=true`,
    )) as ShopApiResponse<ShopVariantCard[]>
    return unwrap(response)
  },

  async getProduct(idOrSlug: string | number): Promise<ShopProduct> {
    const response = (await apiClient.get(`/products/${idOrSlug}`)) as ShopApiResponse<ShopProduct>
    return unwrap(response)
  },
}

export default ShopApi
