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
  sortOrder?: number
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
  showInListing?: boolean
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
  colorIds?: number[]
  sizeIds?: number[]
  minPrice?: number
  maxPrice?: number
  sort?: 'price_asc' | 'price_desc' | 'newest',
  colorId?:number,
  sizeId?:number
}

export type ShopApiResponse<T> = {
  success: boolean
  message?: string
  data: T
}

export type ShopVariantCard = {
  cardId: string
  productId: number
  productSlug: string
  categoryId?: number
  category?: ShopCategory | null
  variantId: number
  name: string
  color?: ShopColor | null
  size?: ShopSize | null
  basePrice: number
  salePrice: number | null
  imageUrl: string | null
  hoverImageUrl: string | null
  isAvailable: boolean
  productIsActive?: boolean
  showInListing?: boolean
}
