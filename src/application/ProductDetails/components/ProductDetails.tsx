import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { ProductDetail } from '../../../data/catalog'
import { useCart } from '../../../contexts/CartContext'
import { useWishlist } from '../../../contexts/WishlistContext'
import { HeartIcon } from '@heroicons/react/24/outline'

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return CURRENCY_FORMATTER.format(value)
}

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

type ProductDetailsProps = {
  product: ProductDetail
}



const ProductDetails = ({ product }: ProductDetailsProps) => {
  const initialImageId = product.gallery[0]?.id ?? ''
  const [activeImageId, setActiveImageId] = useState(initialImageId)
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.id ?? '')
  const [selectedSize, setSelectedSize] = useState(
    product.sizes.find((size) => size.inStock)?.id ?? product.sizes[0]?.id ?? '',
  )
  const [quantity, setQuantity] = useState(1)
  const { addToCart, openCart } = useCart()
  const { contains, toggleWishlist } = useWishlist()
  const isWishlisted = contains(product.id)

  const activeImage = useMemo(() => {
    return product.gallery.find((media) => media.id === activeImageId) ?? product.gallery[0]
  }, [activeImageId, product.gallery])

  const hasDiscount = product.original > product.price
  const discountPercent = hasDiscount ? Math.round(100 - (product.price / product.original) * 100) : 0

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-8xl px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:gap-12">
          <div className="flex w-full flex-col items-center gap-6 lg:max-w-2xl lg:items-start lg:gap-8">
            <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-gray-100 shadow-md lg:h-[500px] xl:h-[600px]">
              {activeImage ? (
                <img
                  alt={activeImage.alt}
                  src={activeImage.src}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                  Image coming soon
                </div>
              )}
            </div>

            {product.gallery.length > 1 && (
              <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-5">
                {product.gallery.map((media) => {
                  const isActive = media.id === (activeImage?.id ?? activeImageId)
                  return (
                    <button
                      key={media.id}
                      type="button"
                      onClick={() => setActiveImageId(media.id)}
                      className={classNames(
                        'group relative overflow-hidden rounded-xl border bg-gray-100 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
                        isActive ? 'border-black shadow-lg' : 'border-transparent hover:border-gray-300',
                      )}
                      aria-label={`View ${product.name} image`}
                    >
                      <img
                        alt={media.alt}
                        src={media.src}
                        className="aspect-square w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <span className="font-medium text-gray-500">{product.sku}</span>
                {product.tag && (
                  <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                    {product.tag}
                  </span>
                )}
                {hasDiscount && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    Save {discountPercent}%
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-semibold leading-tight text-gray-900 sm:text-4xl">{product.name}</h1>
              <p className="max-w-prose text-base leading-relaxed text-gray-600">{product.shortDescription}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-semibold text-gray-900">{formatCurrency(product.price)}</span>
              {hasDiscount && (
                <span className="text-base text-gray-400 line-through">{formatCurrency(product.original)}</span>
              )}
            </div>

            <div className="space-y-6">
              {product.sizes.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-gray-900">Sizes</h2>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {product.sizes.map((size) => {
                      const isSelected = size.id === selectedSize
                      return (
                        <button
                          key={size.id}
                          type="button"
                          disabled={!size.inStock}
                          onClick={() => size.inStock && setSelectedSize(size.id)}
                          className={classNames(
                            'min-w-[3rem] rounded-md border px-3 py-2 text-sm font-medium transition',
                            isSelected ? 'border-black bg-black text-white shadow-md' : 'border-gray-300 text-gray-700 hover:border-gray-400',
                            size.inStock ? 'cursor-pointer' : 'cursor-not-allowed border-dashed text-gray-400 opacity-60',
                          )}
                          aria-pressed={isSelected}
                        >
                          {size.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {product.colors.length > 0 && (
                <div>
                  <h2 className="text-sm font-medium text-gray-900">Select Color</h2>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {product.colors.map((color) => {
                      const isSelected = color.id === selectedColor
                      return (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setSelectedColor(color.id)}
                          className={classNames(
                            'flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black',
                            isSelected ? 'border-black bg-black text-white shadow-md' : 'border-gray-300 text-gray-700 hover:border-gray-400',
                          )}
                          aria-pressed={isSelected}
                        >
                          <span
                            aria-hidden="true"
                            className="inline-flex size-4 rounded-full border border-white shadow ring-1 ring-black/10"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-sm font-medium text-gray-900">Select Quantity</h2>
                <div className="mt-3 flex h-14 w-full max-w-[220px] items-center justify-between rounded-full border border-gray-200 bg-white px-4 shadow-sm">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="text-[32px] font-semibold text-gray-500 transition hover:text-gray-900 disabled:text-gray-300"
                    disabled={quantity <= 1}
                  >
                    &minus;
                  </button>
                  <span className="text-lg font-semibold text-gray-900">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="text-[32px] font-semibold text-gray-500 transition hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  addToCart(product, {
                    colorId: selectedColor,
                    sizeId: selectedSize,
                    quantity,
                  })
                  openCart()
                }}
                className="flex w-auto items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Cart +
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={classNames(
                  'flex items-center justify-center rounded-full border px-5 py-2 text-sm font-semibold transition',
                  isWishlisted
                    ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                    : 'border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900',
                )}
              >
                <HeartIcon className="mr-2 h-4 w-4" />
                {isWishlisted ? 'Saved' : 'Wishlist'}
              </button>
            </div>
          </div>
        </div>

        <ProductInfoTabs product={product} className="mt-16" />
      </div>
    </section>
  )
}

export default ProductDetails


type ProductInfoTab = {
  id: string
  label: string
  panel: ReactNode
}

const ProductInfoTabs = ({ product, className }: { product: ProductDetail; className?: string }) => {
  const [activeTab, setActiveTab] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [indicatorStyles, setIndicatorStyles] = useState({ width: 0, left: 0 })
  const sizeGuideImage =
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80'

  const tabs: ProductInfoTab[] = useMemo(() => {
    return [
      {
        id: 'description',
        label: 'Description',
        panel: (
          <div className="space-y-5 text-left text-sm leading-relaxed text-gray-600">
            <p>{product.shortDescription}</p>
            <p>{product.description}</p>
            {product.highlights.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-500">Highlights</h3>
                <ul className="space-y-2">
                  {product.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="relative pl-5 text-sm text-gray-600 before:absolute before:left-0 before:top-2 before:size-1.5 before:rounded-full before:bg-gray-900"
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ),
      },
      {
        id: 'size',
        label: 'Size & Fit',
        panel: (
          <div className="space-y-5 text-left text-sm leading-relaxed text-gray-600">
            <p>
              Use our quick guide to match your measurements. Measure your chest, waist, and hip, then compare with the
              chart below for the best fit.
            </p>
            <img
              alt="Size guide measurements"
              src={sizeGuideImage}
              className="mx-auto w-full max-w-3xl rounded-xl border border-gray-200 object-cover"
              loading="lazy"
            />
            <p className="text-xs text-gray-500">
              Between sizes? Choose the larger option for a relaxed look or size down for a closer fit.
            </p>
          </div>
        ),
      },
      {
        id: 'shipping',
        label: 'Shipping',
        panel: (
          <div className="space-y-5 text-left text-sm leading-relaxed text-gray-600">
            <p>We dispatch every order within 1-2 working days from our Bengaluru studio.</p>
            <ul className="space-y-2 text-sm text-gray-600">
              {[
                'Free standard delivery on orders above Rs 1,999 across India.',
                'Express shipping available for metro cities with checkout upgrade.',
                'Easy 10-day return window on unused items with original tags.',
              ].map((item) => (
                <li
                  key={item}
                  className="relative pl-5 before:absolute before:left-0 before:top-2 before:size-1.5 before:rounded-full before:bg-gray-900"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500">
              Need help? Write to{' '}
              <a href="mailto:care@steezfit.in" className="font-medium text-gray-900 underline">
                care@steezfit.in
              </a>{' '}
              for delivery updates or size assistance.
            </p>
          </div>
        ),
      },
    ]
  }, [product.description, product.highlights, product.shortDescription])

  useEffect(() => {
    const currentButton = tabRefs.current[activeTab]
    if (!currentButton) {
      return
    }
    const updateIndicator = () => {
      const parentRect = currentButton.parentElement?.getBoundingClientRect()
      const buttonRect = currentButton.getBoundingClientRect()
      if (!parentRect) {
        return
      }
      setIndicatorStyles({
        width: buttonRect.width,
        left: buttonRect.left - parentRect.left,
      })
    }
    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => {
      window.removeEventListener('resize', updateIndicator)
    }
  }, [activeTab])

  const wrapperClass = classNames('border-t border-gray-200 pt-10', className ?? 'mt-14')

  return (
    <div className={wrapperClass}>
      <div className="flex justify-center">
        <div className="relative flex gap-8 border-b border-gray-200">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              onClick={() => setActiveTab(index)}
              className={classNames(
                'pb-2 text-sm font-semibold uppercase tracking-[0.25em] text-gray-500 transition-colors duration-200',
                activeTab === index ? 'text-gray-900' : 'hover:text-gray-800',
              )}
            >
              {tab.label}
            </button>
          ))}
          <span
            className="pointer-events-none absolute bottom-[-1px] h-0.5 bg-gray-900 transition-all duration-300 ease-out"
            style={{
              width: indicatorStyles.width,
              transform: `translateX(${indicatorStyles.left}px)`,
            }}
          />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <div key={tabs[activeTab].id} className="fade-slide-in space-y-6 text-left text-sm leading-relaxed text-gray-600">
          {tabs[activeTab].panel}
        </div>
      </div>
    </div>
  )
}
