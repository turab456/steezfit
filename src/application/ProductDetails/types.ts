export type ProductCategory = {
  id: number
  name: string
  slug: string
}

export type ProductCollection = {
  id: number
  name: string
  slug: string
}

export type ProductColor = {
  id: number
  name: string
  code: string
  hexCode: string
}

export type ProductSize = {
  id: number
  code: string
  label: string
}

export type ProductImage = {
  id: number
  imageUrl: string
  isPrimary: boolean
  sortOrder: number
  color?: ProductColor | null
}

export type ProductVariant = {
  id: number
  sku: string
  stockQuantity: number
  basePrice: number
  salePrice: number | null
  isAvailable: boolean
  color?: ProductColor | null
  size?: ProductSize | null
}

export type ProductApiResponse = {
  success: boolean
  message?: string
  data: {
    id: number
    name: string
    slug: string
    shortDescription?: string
    description?: string
    gender?: string
    isActive: boolean
    categoryId: number
    collectionId?: number | null
    category?: ProductCategory | null
    collection?: ProductCollection | null
    images: ProductImage[]
    variants: ProductVariant[]
  }
}

export type ProductGalleryItem = {
  id: string
  src: string
  alt: string
  colorId?: number | null
}

export type ProductColorOption = {
  id: number
  value: string
  name: string
}

export type ProductSizeOption = {
  id: number
  name: string
  code?: string
  inStock: boolean
}

export type ProductDetailVariant = {
  id: number
  colorId: number | null
  sizeId: number | null
  stockQuantity: number
  isAvailable: boolean
  basePrice: number
  salePrice: number | null
}

export type ProductDetail = {
  backendId?: number
  id: string
  slug: string
  name: string
  price: number
  original: number
  shortDescription: string
  description: string
  gallery: ProductGalleryItem[]
  images: { primary: string; hover: string }
  colors: ProductColorOption[]
  sizes: ProductSizeOption[]
  highlights: string[]
  variants: ProductDetailVariant[]
  sku?: string
}
