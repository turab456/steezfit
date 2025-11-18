'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ShoppingCartIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useCart } from '../../../contexts/CartContext'
import { useWishlist } from '../../../contexts/WishlistContext'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export default function WishlistLayout() {
  const { items, isOpen, closeWishlist, removeFromWishlist } = useWishlist()
  const { addToCart, openCart } = useCart()

  return (
    <Dialog open={isOpen} onClose={closeWishlist} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            <DialogPanel className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col  bg-white shadow-2xl ring-1 ring-black/5">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-5">
                  <DialogTitle className="text-lg font-semibold text-gray-900">Wishlist</DialogTitle>
                  <button
                    type="button"
                    onClick={closeWishlist}
                    className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    <span className="sr-only">Close wishlist</span>
                    <XMarkIcon className="size-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                      <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-500">Empty</p>
                      <p className="text-lg font-semibold text-gray-900">Save your favorite looks here.</p>
                      <p className="text-sm text-gray-500">
                        Tap the heart icon on any product to keep it handy for later.
                      </p>
                    </div>
                  ) : (
                    <ul role="list" className="space-y-6 pb-8">
                      {items.map((item) => {
                        const imageUrl = item.gallery[0]?.src ?? item.images.primary
                        return (
                          <li key={item.id} className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-3 shadow-sm shadow-gray-100 sm:flex-row">
                            <div className="size-20 h-20 w-20 overflow-hidden rounded-2xl bg-gray-100">
                              <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                            </div>
                            <div className="flex flex-1 flex-col justify-between gap-1 text-sm text-gray-600">
                              <Link to={`/product/${item.id}`} className="text-base font-semibold text-gray-900">
                                {item.name}
                              </Link>
                              <p className="uppercase tracking-[0.3em] text-xs text-gray-500">{item.sku}</p>
                              <p className="text-sm text-gray-900">{formatCurrency(item.price)}</p>
                              <div className="flex gap-2 text-gray-500">
                                <button
                                  type="button"
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="rounded-full border border-transparent p-2 text-gray-500 transition hover:text-gray-900 hover:border-gray-300"
                                >
                                  <span className="sr-only">Remove from wishlist</span>
                                  <TrashIcon className="h-4 w-4" aria-hidden="true" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const defaultColor = item.colors[0]?.id
                                    const defaultSize =
                                      item.sizes.find((size) => size.inStock)?.id ?? item.sizes[0]?.id ?? ''
                                    addToCart(item, {
                                      colorId: defaultColor,
                                      sizeId: defaultSize,
                                      quantity: 1,
                                    })
                                    openCart()
                                  }}
                                  className="rounded-full border border-transparent p-2 text-gray-500 transition hover:text-gray-900 hover:border-gray-300"
                                >
                                  <span className="sr-only">Add wishlist item to cart</span>
                                  <ShoppingCartIcon className="h-4 w-4" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="border-t border-gray-200 px-4 py-6">
                    <Link
                      to="/shop"
                      className="flex w-full items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
                    >
                      Shop new arrivals
                    </Link>
                  </div>
                )}
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
