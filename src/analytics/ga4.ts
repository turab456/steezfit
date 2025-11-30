declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export type GAProduct = {
  id: string
  name: string
  price?: number
  brand?: string
  category?: string
  variant?: string
  sku?: string
  image?: string
  url?: string
  currency?: string
  availability?: string
}

export const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-DF4TWDR8N1'

const isGtagReady = () =>
  typeof window !== 'undefined' && typeof window.gtag === 'function'

export const ensureGAStub = () => {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  if (!window.gtag) {
    window.gtag = function gtag(...args) {
      window.dataLayer?.push(args)
    }
  }
}

const withSendTo = (payload: Record<string, unknown>) => ({
  send_to: GA_MEASUREMENT_ID,
  ...payload,
})

export const trackPageView = (path: string, title?: string) => {
  if (!isGtagReady()) return
  window.gtag?.(
    'event',
    'page_view',
    withSendTo({
      page_path: path,
      page_title: title,
    }),
  )
}

const toGAItem = (product: GAProduct) => ({
  item_id: product.sku || product.id,
  item_name: product.name,
  item_brand: product.brand || 'Aesthco',
  item_category: product.category,
  item_variant: product.variant,
  price: product.price,
  currency: product.currency || 'INR',
  item_image_url: product.image,
})

export const trackViewItem = (product: GAProduct) => {
  if (!isGtagReady()) return
  window.gtag?.(
    'event',
    'view_item',
    withSendTo({
      currency: product.currency || 'INR',
      value: product.price,
      items: [toGAItem(product)],
    }),
  )
}

export const trackAddToCart = (product: GAProduct, quantity = 1) => {
  if (!isGtagReady()) return
  const price = product.price ?? 0
  window.gtag?.(
    'event',
    'add_to_cart',
    withSendTo({
      currency: product.currency || 'INR',
      value: price * quantity,
      items: [
        {
          ...toGAItem(product),
          quantity,
        },
      ],
    }),
  )
}
