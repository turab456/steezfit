'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import type { Product } from '../../../components/Product/types'
import { ProductCard } from '../../../components/Product/ProductCard'
import ShopApi from '../api/ShopApi'
import MasterApi from '../../../services/MasterData'
import type { ShopCategory, ShopColor, ShopProductFilters, ShopSize, ShopVariantCard } from '../types'

const sortOptions = [
  { name: 'Newest', value: 'newest' as const },
  { name: 'Price: Low to High', value: 'price_asc' as const },
  { name: 'Price: High to Low', value: 'price_desc' as const },
]

type FilterOption = { value: number; label: string }
type FilterSection = { id: 'color' | 'category' | 'size'; name: string; options: FilterOption[] }

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [optionSourceProducts, setOptionSourceProducts] = useState<Product[]>([])
  const [masterData, setMasterData] = useState<{
    categories: ShopCategory[]
    colors: ShopColor[]
    sizes: ShopSize[]
  }>({
    categories: [],
    colors: [],
    sizes: [],
  })
  const [activeFilters, setActiveFilters] = useState<ShopProductFilters>({ sort: 'newest' })
  const [activeSort, setActiveSort] = useState(sortOptions[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ref to the header so we can measure height and set the sticky top dynamically
  const headerRef = useRef<HTMLHeadingElement | null>(null)
  const [headerHeight, setHeaderHeight] = useState(96) // default fallback (px)

  useEffect(() => {
    function updateHeaderHeight() {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect()
        // add a small extra gap (16px) so the sticky doesn't butt up against the heading
        setHeaderHeight(Math.ceil(rect.height + 16))
      } else {
        setHeaderHeight(96)
      }
    }

    updateHeaderHeight()
    // update on resize (debounce-ish)
    let t: number | undefined
    function onResize() {
      window.clearTimeout(t)
      t = window.setTimeout(updateHeaderHeight, 100)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    let isCancelled = false
    const fetchMasters = async () => {
      try {
        const [categories, colors, sizes] = await Promise.all([
          MasterApi.getCategories(),
          MasterApi.getColors(),
          MasterApi.getSizes(),
        ])
        if (isCancelled) return
        setMasterData({
          categories,
          colors,
          sizes,
        })
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load filters.')
        }
      }
    }

    fetchMasters()
    return () => {
      isCancelled = true
    }
  }, [])

  const mapVariantToCard = useCallback((variantCard: ShopVariantCard): Product => {
    const primaryImage = variantCard.imageUrl || FALLBACK_IMAGE
    const hoverImage = variantCard.hoverImageUrl || primaryImage

    const basePrice = Number(variantCard.basePrice) || 0
    const salePrice = variantCard.salePrice != null ? Number(variantCard.salePrice) : null
    const hasSale = salePrice !== null && salePrice > 0 && salePrice < basePrice

    const price = hasSale ? salePrice : basePrice
    const original = hasSale ? basePrice : price
    const colorSuffix = variantCard.color?.name ? ` (${variantCard.color.name})` : ''

    return {
      id: variantCard.productSlug || String(variantCard.productId),
      cardId: variantCard.cardId,
      name: `${variantCard.name}${colorSuffix}`,
      price,
      original,
      images: {
        primary: primaryImage,
        hover: hoverImage,
      },
      tag: '',
      isActive: variantCard.productIsActive ?? true,
      isAvailable: variantCard.isAvailable,
      productSlug: variantCard.productSlug,
      detailPath: `/product/${variantCard.productSlug || variantCard.productId}`,
      selectedColorId: variantCard.color?.id,
      selectedSizeId: variantCard.size?.id,
      categoryId: variantCard.categoryId,
    }
  }, [])

  useEffect(() => {
    let isCancelled = false
    const fetchProducts = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await ShopApi.listVariantCards(activeFilters)
        if (isCancelled) return
        const activeOnly = data.filter((card) => card.productIsActive ?? true)
        const mapped = activeOnly.map(mapVariantToCard)
        setProducts(mapped)
        const hasNoFacetFilters =
          !(activeFilters.colorIds?.length || activeFilters.sizeIds?.length || activeFilters.categoryId)
        if (hasNoFacetFilters) {
          setOptionSourceProducts(mapped)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products.')
          setProducts([])
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchProducts()
    return () => {
      isCancelled = true
    }
  }, [activeFilters, mapVariantToCard])

  const filterSections: FilterSection[] = useMemo(() => {
    const source = optionSourceProducts.length ? optionSourceProducts : products
    const productCategoryIds = new Set<number>()
    const productColorIds = new Set<number>()
    const productSizeIds = new Set<number>()

    source.forEach((p) => {
      if (typeof p.categoryId === 'number') productCategoryIds.add(p.categoryId)
      if (typeof (p as any).selectedColorId === 'number') productColorIds.add((p as any).selectedColorId)
      if (typeof (p as any).selectedSizeId === 'number') productSizeIds.add((p as any).selectedSizeId)
    })

    // Always keep currently selected filter ids visible even if not in the current source
    ;(activeFilters.colorIds || []).forEach((id) => productColorIds.add(id))
    if (activeFilters.categoryId) productCategoryIds.add(activeFilters.categoryId)
    ;(activeFilters.sizeIds || []).forEach((id) => productSizeIds.add(id))

    return [
      {
        id: 'color',
        name: 'Color',
        options: masterData.colors
          .filter((color) => productColorIds.size === 0 || productColorIds.has(color.id))
          .map((color) => ({ value: color.id, label: color.name })),
      },
      {
        id: 'category',
        name: 'Category',
        options: masterData.categories
          .filter((category) => productCategoryIds.size === 0 || productCategoryIds.has(category.id))
          .map((category) => ({ value: category.id, label: category.name })),
      },
      {
        id: 'size',
        name: 'Size',
        options: masterData.sizes
          .filter((size) => productSizeIds.size === 0 || productSizeIds.has(size.id))
          .map((size) => ({ value: size.id, label: size.label })),
      },
    ]
  }, [activeFilters.categoryId, activeFilters.colorIds, activeFilters.sizeIds, masterData, optionSourceProducts, products])

  const isOptionSelected = useCallback(
    (sectionId: FilterSection['id'], value: number) => {
      if (sectionId === 'color') return activeFilters.colorIds?.includes(value) ?? false
      if (sectionId === 'category') return activeFilters.categoryId === value
      if (sectionId === 'size') return activeFilters.sizeIds?.includes(value) ?? false
      return false
    },
    [activeFilters.categoryId, activeFilters.colorIds, activeFilters.sizeIds],
  )

  const handleFilterToggle = useCallback((sectionId: FilterSection['id'], value: number) => {
    setActiveFilters((prev) => {
      const next: ShopProductFilters = { ...prev }
      if (sectionId === 'color') {
        const current = prev.colorIds || []
        next.colorIds = current.includes(value) 
          ? current.filter(id => id !== value)
          : [...current, value]
        if (next.colorIds.length === 0) next.colorIds = undefined
      } else if (sectionId === 'category') {
        next.categoryId = prev.categoryId === value ? undefined : value
      } else if (sectionId === 'size') {
        const current = prev.sizeIds || []
        next.sizeIds = current.includes(value)
          ? current.filter(id => id !== value)
          : [...current, value]
        if (next.sizeIds.length === 0) next.sizeIds = undefined
      }
      return next
    })
  }, [])

  const handleSortChange = useCallback(
    (option: (typeof sortOptions)[number]) => {
      setActiveSort(option)
      setActiveFilters((prev) => ({ ...prev, sort: option.value }))
    },
    [],
  )

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-40 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="relative -mr-2 flex size-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters for mobile */}
              <form className="mt-4 border-t border-gray-200">
                <h3 className="sr-only">Categories</h3>
                <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                  {masterData.categories.map((category) => (
                    <li key={category.id}>
                      <button
                        type="button"
                        onClick={() => handleFilterToggle('category', category.id)}
                        className="block w-full px-2 py-3 text-left"
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>

                {filterSections.map((section) => (
                  <Disclosure key={section.id} as="div" className="border-t border-gray-200 px-4 py-6">
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                        <span className="font-medium text-gray-900">{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                          <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-6">
                      <div className="space-y-6">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex gap-3">
                            <div className="flex h-5 shrink-0 items-center">
                              <div className="group grid size-4 grid-cols-1">
                                <input
                                  value={option.value}
                                  checked={isOptionSelected(section.id, option.value)}
                                  onChange={() => handleFilterToggle(section.id, option.value)}
                                  id={`filter-mobile-${section.id}-${optionIdx}`}
                                  name={`${section.id}[]`}
                                  type="checkbox"
                                  className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                />
                                <svg
                                  fill="none"
                                  viewBox="0 0 14 14"
                                  className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                >
                                  <path
                                    d="M3 8L6 11L11 3.5"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-checked:opacity-100"
                                  />
                                  <path
                                    d="M3 7H11"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="opacity-0 group-has-indeterminate:opacity-100"
                                  />
                                </svg>
                              </div>
                            </div>
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="min-w-0 flex-1 text-gray-500"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          {/* Page heading - we measure this to compute sticky offset */}
          <div className="flex items-baseline justify-between border-b border-gray-200 pt-16 pb-6">
            <h1 ref={headerRef} className="text-4xl font-bold tracking-tight text-gray-900">
              Shop
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  Sort
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                  />
                </MenuButton>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                >
                  <div className="py-1">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value}>
                        <button
                          type="button"
                          onClick={() => handleSortChange(option)}
                          className={classNames(
                            activeSort.value === option.value ? 'font-medium text-gray-900' : 'text-gray-500',
                            'block w-full px-4 py-2 text-left text-sm data-focus:bg-gray-100 data-focus:outline-hidden',
                          )}
                        >
                          {option.name}
                        </button>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                <span className="sr-only">View grid</span>
                <Squares2X2Icon aria-hidden="true" className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-6 pb-24">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Desktop Filters (sticky behavior) */}
              <div className="hidden lg:block">
                {/* 
                  This wrapper is sticky. We compute top and maxHeight dynamically from headerHeight.
                  The wrapper remains in normal flow until the page scrolls past the top offset.
                */}
                <div
                  // inline styles computed to match header height + small gap
                  style={{
                    top: `${headerHeight}px`,
                    maxHeight: `calc(100vh - ${headerHeight}px)`,
                  }}
                  className="sticky self-start overflow-auto pr-4"
                >
                  <form>
                    <h3 className="sr-only">Categories</h3>
                    <ul role="list" className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                      {masterData.categories.map((category) => (
                        <li key={category.id}>
                          <button
                            type="button"
                            onClick={() => handleFilterToggle('category', category.id)}
                            className="text-left"
                          >
                            {category.name}
                          </button>
                        </li>
                      ))}
                    </ul>

                    {filterSections.map((section) => (
                      <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-6">
                        <h3 className="-my-3 flow-root">
                          <DisclosureButton className="group flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">{section.name}</span>
                            <span className="ml-6 flex items-center">
                              <PlusIcon aria-hidden="true" className="size-5 group-data-open:hidden" />
                              <MinusIcon aria-hidden="true" className="size-5 group-not-data-open:hidden" />
                            </span>
                          </DisclosureButton>
                        </h3>
                        <DisclosurePanel className="pt-6">
                          <div className="space-y-4">
                            {section.options.map((option, optionIdx) => (
                              <div key={option.value} className="flex gap-3">
                                <div className="flex h-5 shrink-0 items-center">
                                  <div className="group grid size-4 grid-cols-1">
                                    <input
                                      value={option.value}
                                      checked={isOptionSelected(section.id, option.value)}
                                      onChange={() => handleFilterToggle(section.id, option.value)}
                                      id={`filter-${section.id}-${optionIdx}`}
                                      name={`${section.id}[]`}
                                      type="checkbox"
                                      className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                    />
                                    <svg
                                      fill="none"
                                      viewBox="0 0 14 14"
                                      className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                                    >
                                      <path
                                        d="M3 8L6 11L11 3.5"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-0 group-has-checked:opacity-100"
                                      />
                                      <path
                                        d="M3 7H11"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="opacity-0 group-has-indeterminate:opacity-100"
                                      />
                                    </svg>
                                  </div>
                                </div>
                                <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm text-gray-600">
                                  {option.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </DisclosurePanel>
                      </Disclosure>
                    ))}
                  </form>
                </div>
              </div>

              {/* Product grid / main content */}
              <div className="lg:col-span-3">
                {loading ? (
                  <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
                    Loading products...
                  </div>
                ) : error ? (
                  <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 px-4 text-sm font-medium text-red-600">
                    {error}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3" role="list">
                    {products.map((product) => (
                      <ProductCard key={product.cardId ?? product.id} p={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
                    No products available right now. Try adjusting your filters.
                  </div>
                )}

                {/* Extra bottom spacing so the sticky can scroll past content nicely */}
                <div className="mt-12 h-24" />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

