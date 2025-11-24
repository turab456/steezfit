import apiClient from '../../../services/ApiClient'
import type {
  ProductApiResponse,
  ProductDetail,
  ProductDetailVariant,
  ProductGalleryItem,
  ProductSizeOption,
  ProductColorOption,
} from '../types'

const unwrap = <T>(response: { success: boolean; message?: string; data: T }): T => {
  if (!response.success) {
    throw new Error(response.message || 'Failed to fetch product.')
  }
  return response.data
}

const mapToDetail = (raw: ProductApiResponse['data']): ProductDetail => {
  const variants: ProductDetailVariant[] = (raw.variants || []).map((variant) => ({
    id: variant.id,
    colorId: variant.color?.id ?? null,
    sizeId: variant.size?.id ?? null,
    stockQuantity: variant.stockQuantity ?? 0,
    isAvailable: Boolean(variant.isAvailable) && ((variant.stockQuantity ?? 0) > 0),
    basePrice: Number(variant.basePrice),
    salePrice: variant.salePrice != null ? Number(variant.salePrice) : null,
    showInListing: variant.showInListing ?? true,
  }))

  const colorMap = new Map<number, ProductColorOption>()
  variants.forEach((variant) => {
    const color = raw.variants.find((v) => v.id === variant.id)?.color
    if (color && !colorMap.has(color.id)) {
      colorMap.set(color.id, {
        id: color.id,
        name: color.name ?? '',
        value: color.hexCode || color.code || '#000000',
      })
    }
  })

  raw.images?.forEach((img) => {
    if (img.color?.id && !colorMap.has(img.color.id)) {
      colorMap.set(img.color.id, {
        id: img.color.id,
        name: img.color.name ?? '',
        value: img.color.hexCode || img.color.code || '#000000',
      })
    }
  })

  const sizes: ProductSizeOption[] = []
  const sizeSeen = new Set<number>()
  variants.forEach((variant) => {
    const size = raw.variants.find((v) => v.id === variant.id)?.size
    if (size && !sizeSeen.has(size.id)) {
      const inStock = variants.some(
        (v) =>
          v.sizeId === size.id &&
          v.isAvailable &&
          (v.stockQuantity === undefined || v.stockQuantity > 0),
      )
      sizeSeen.add(size.id)
      sizes.push({
        id: size.id,
        name: size.code || size.label || '',
        code: size.code,
        inStock,
        sortOrder: typeof size.sortOrder === 'number' ? size.sortOrder : undefined,
      })
    }
  })
  sizes.sort((a, b) => {
    const aOrder = a.sortOrder ?? Number.MAX_SAFE_INTEGER
    const bOrder = b.sortOrder ?? Number.MAX_SAFE_INTEGER
    if (aOrder !== bOrder) return aOrder - bOrder
    return a.name.localeCompare(b.name)
  })

  const sortedImages = [...(raw.images || [])].sort((a, b) => {
    if (a.isPrimary === b.isPrimary) {
      return a.sortOrder - b.sortOrder
    }
    return a.isPrimary ? -1 : 1
  })

  const gallery: ProductGalleryItem[] = sortedImages.map((img, index) => ({
    id: `img-${img.id ?? index}`,
    src: img.imageUrl,
    alt: raw.name,
    colorId: img.color?.id ?? null,
  }))

  const primaryImage = gallery[0]?.src || ''
  const hoverImage = gallery[1]?.src || primaryImage
  const sku = raw.variants[0]?.sku

  const priceCandidates = variants.filter((v) => Number.isFinite(v.basePrice))
  const basePrices = priceCandidates.map((v) => v.basePrice)
  const salePrices = priceCandidates
    .map((v) => (v.salePrice != null ? v.salePrice : null))
    .filter((value): value is number => value !== null)

  const minBasePrice = basePrices.length ? Math.min(...basePrices) : 0
  const minSalePrice = salePrices.length ? Math.min(...salePrices) : null

  const price =
    minSalePrice !== null && minSalePrice > 0 && (minSalePrice < minBasePrice || minBasePrice === 0)
      ? minSalePrice
      : minBasePrice
  const original = minSalePrice !== null && minSalePrice < minBasePrice ? minBasePrice : price

  return {
    backendId: raw.id,
    id: raw.slug || String(raw.id),
    slug: raw.slug || String(raw.id),
    name: raw.name,
    isActive: raw.isActive,
    price,
    original,
    shortDescription: raw.shortDescription || '',
    description: raw.description || '',
    gallery,
    images: { primary: primaryImage, hover: hoverImage },
    colors: Array.from(colorMap.values()),
    sizes,
    highlights: [],
    variants,
    sku,
  }
}

const ProductDetailsApi = {
  async getByIdOrSlug(idOrSlug: string): Promise<ProductDetail> {
    const response = (await apiClient.get(`/products/${idOrSlug}`)) as ProductApiResponse
    const data = unwrap(response)
    return mapToDetail(data)
  },
}

export default ProductDetailsApi
