import type { ProductDetail } from '../application/ProductDetails/types'
import type { GAProduct } from './ga4'

export const buildVariantLabel = (
  product: ProductDetail,
  colorId?: string | number | null,
  sizeId?: string | number | null,
) => {
  const colorName = colorId != null
    ? product.colors.find((c) => String(c.id) === String(colorId))?.name
    : undefined
  const sizeName = sizeId != null
    ? product.sizes.find((s) => String(s.id) === String(sizeId))?.name
    : undefined

  return [colorName, sizeName].filter(Boolean).join(' / ') || undefined
}

export const toGAProductFromDetail = (
  product: ProductDetail,
  colorId?: string | number | null,
  sizeId?: string | number | null,
): GAProduct => ({
  id: product.slug || product.id,
  sku: product.sku || product.id,
  name: product.name,
  price: product.price,
  brand: 'Aesthco',
  variant: buildVariantLabel(product, colorId, sizeId),
  image: product.images?.primary || product.gallery[0]?.src,
  availability: product.isActive === false ? 'OutOfStock' : 'InStock',
  currency: 'INR',
})
