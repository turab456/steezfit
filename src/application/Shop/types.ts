export type ShopCategory = {
  id: number
  name: string
  slug: string
}

export type ShopCollection = {
  id: number
  name: string
  slug: string
}

export type ShopColor = {
  id: number
  name: string
  code: string
  hexCode: string
}

export type ShopSize = {
  id: number
  code: string
  label: string
}

export type ShopProductImage = {
  id: number
  imageUrl: string
  isPrimary: boolean
  sortOrder: number
  color?: ShopColor | null
}

export type ShopProductVariant = {
  id: number
  sku: string
  stockQuantity: number
  basePrice: number
  salePrice: number | null
  isAvailable: boolean
  color?: ShopColor | null
  size?: ShopSize | null
}

export type ShopProduct = {
  id: number
  name: string
  slug: string
  shortDescription?: string
  description?: string
  gender?: string
  isActive: boolean
  categoryId: number
  collectionId?: number | null
  category?: ShopCategory | null
  collection?: ShopCollection | null
  images: ShopProductImage[]
  variants: ShopProductVariant[]
}

export type ShopProductFilters = {
  categoryId?: number
  collectionId?: number
  colorId?: number
  sizeId?: number
  minPrice?: number
  maxPrice?: number
  sort?: 'price_asc' | 'price_desc' | 'newest'
}

export type ShopApiResponse<T> = {
  success: boolean
  message?: string
  data: T
}
