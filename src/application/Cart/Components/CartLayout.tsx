'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useCart } from '../../../contexts/CartContext'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export default function CartLayout() {
  const { items, isOpen, closeCart, subtotal, removeFromCart, updateQuantity } = useCart()
  const shipping = subtotal === 0 ? 0 : subtotal >= 1999 ? 0 : 199
  const total = subtotal + shipping

  return (
    <Dialog open={isOpen} onClose={closeCart} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-4">
            <DialogPanel className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col overflow-hidden  bg-white shadow-2xl ring-1 ring-black/5">
                <div className="flex items-center justify-between border-b border-gray-200 px-4 py-5">
                  <DialogTitle className="text-lg font-semibold text-gray-900">Shopping cart</DialogTitle>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
                  >
                    <span className="sr-only">Close cart</span>
                    <XMarkIcon className="size-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center">
                      <p className="text-xs uppercase tracking-[0.4em] text-gray-500">Empty cart</p>
                      <h3 className="text-lg font-semibold text-gray-900">Add something nice to get started.</h3>
                    </div>
                  ) : (
                    <ul role="list" className="space-y-6">
                      {items.map((item) => {
                        const colorLabel = item.product.colors.find((color) => color.id === item.selectedColorId)
                        const sizeLabel = item.product.sizes.find((size) => size.id === item.selectedSizeId)
                        const imageUrl = item.product.gallery[0]?.src ?? item.product.images.primary

                        return (
                          <li
                            key={item.id}
                            className="flex flex-col gap-3 rounded-2xl border border-gray-100 px-4 py-5 shadow-sm shadow-gray-100 sm:flex-row sm:items-center"
                          >
                            <div className="size-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                              <img src={imageUrl} alt={item.product.name} className="size-full object-cover" loading="lazy" />
                            </div>

                            <div className="ml-0 flex flex-1 flex-col gap-2 text-sm text-gray-500 sm:ml-4">
                              <div className="flex items-start justify-between text-base font-medium text-gray-900">
                                <h3>{item.product.name}</h3>
                                <p>{formatCurrency(item.product.price * item.quantity)}</p>
                              </div>
                              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">{item.product.sku}</p>
                              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase text-gray-500">
                                {colorLabel && <span>{colorLabel.name}</span>}
                                {sizeLabel && <span>{sizeLabel.name}</span>}
                              </div>

                              <div className="flex flex-1 items-center justify-between text-xs font-medium uppercase tracking-[0.3em] text-gray-500">
                                <label htmlFor={`cart-qty-${item.id}`} className="hidden">
                                  Quantity
                                </label>
                                <div className="flex items-center gap-3 text-gray-700">
                                  <span>Qty</span>
                                  <div className="flex items-center rounded-full border border-gray-300 bg-white px-2 text-sm font-semibold text-gray-900">
                                    <button
                                      type="button"
                                      className="px-2 text-lg text-gray-500 transition hover:text-gray-900 disabled:text-gray-300"
                                      onClick={() =>
                                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                                      }
                                      disabled={item.quantity <= 1}
                                      aria-label="Decrease quantity"
                                    >
                                      &minus;
                                    </button>
                                    <span className="px-3">{item.quantity}</span>
                                    <button
                                      type="button"
                                      className="px-2 text-lg text-gray-500 transition hover:text-gray-900"
                                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      aria-label="Increase quantity"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-xs font-semibold text-gray-500 underline decoration-dotted decoration-gray-400 transition hover:text-gray-900"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>

                <div className="border-t border-gray-200 px-4 py-6">
                  <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
                    <span>Subtotal</span>
                    <span className="text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
                    <span>Shipping</span>
                    <span className="text-gray-900">{formatCurrency(shipping)}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-lg font-semibold text-gray-900">
                    <span>Estimated total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      type="button"
                      disabled={items.length === 0}
                      className="flex w-full items-center justify-center rounded-full bg-black px-6 py-3 text-base font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      Checkout
                    </button>
                    <button
                      type="button"
                      onClick={closeCart}
                      className="flex w-full items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-base font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
                    >
                      Continue shopping
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-gray-500">
                    Free delivery for orders over ₹1,999. Returns accepted within 10 days.
                  </p>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}
