'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../contexts/CartContext'
import OrderApi from '../../Orders/api/OrderApi'

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
  const [shippingSetting, setShippingSetting] = useState({ freeShippingThreshold: 1999, shippingFee: 0 })
  
  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= Number(shippingSetting.freeShippingThreshold || 0)
      ? 0
      : Number(shippingSetting.shippingFee || 0)
      
  const total = Number(subtotal || 0) + shipping
  const navigate = useNavigate()
  const hasInactiveItem = items.some((item) => item.product.isActive === false)
  const freeShippingLabel = formatCurrency(Number(shippingSetting.freeShippingThreshold || 0))

  const handleCheckout = () => {
    if (hasInactiveItem) return
    closeCart()
    navigate('/checkout')
  }

  useEffect(() => {
    OrderApi.getShippingSetting()
      .then((setting) => {
        if (setting) {
          setShippingSetting({
            freeShippingThreshold: Number(setting.freeShippingThreshold ?? 0),
            shippingFee: Number(setting.shippingFee ?? 0),
          })
        }
      })
      .catch(() => {
        setShippingSetting({ freeShippingThreshold: 1999, shippingFee: 0 })
      })
  }, [])

  return (
    <Dialog open={isOpen} onClose={closeCart} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
            {/* Reverted to your exact original size classes */}
            <DialogPanel className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col bg-white shadow-xl">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-5 sm:px-6">
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    Shopping Cart
                    <span className="ml-2 text-sm font-normal text-gray-500">({items.length})</span>
                  </DialogTitle>
                  <button
                    type="button"
                    onClick={closeCart}
                    className="relative -m-2 rounded-md p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 no-scrollbar" data-lenis-prevent>
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-4 rounded-full bg-gray-50 p-4">
                        <ShoppingBagIcon className="h-8 w-8 text-gray-300" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Your bag is empty</h3>
                      <button 
                        onClick={closeCart} 
                        className="mt-4 text-sm font-semibold text-gray-900 underline underline-offset-4"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <ul role="list" className="space-y-8">
                      {items.map((item) => {
                        const selectedColor = item.selectedColorId
                          ? item.product.colors.find((color) => String(color.id) === String(item.selectedColorId))
                          : undefined
                        const selectedSize = item.selectedSizeId
                          ? item.product.sizes.find((size) => String(size.id) === String(item.selectedSizeId))
                          : undefined
                        
                        const matchedVariant =
                          item.product.variants.find(
                            (variant) =>
                              (item.selectedColorId ? String(variant.colorId) === String(item.selectedColorId) : true) &&
                              (item.selectedSizeId ? String(variant.sizeId) === String(item.selectedSizeId) : true),
                          ) ??
                          (item.selectedColorId
                            ? item.product.variants.find(
                                (variant) => String(variant.colorId) === String(item.selectedColorId),
                              )
                            : undefined) ??
                          (item.selectedSizeId
                            ? item.product.variants.find(
                                (variant) => String(variant.sizeId) === String(item.selectedSizeId),
                              )
                            : undefined) ??
                          item.product.variants[0]
                          
                        const stockQty = matchedVariant?.stockQuantity ?? 0
                        const isProductActive = item.product.isActive !== false
                        const variantAvailable = isProductActive && Boolean(matchedVariant?.isAvailable) && stockQty > 0
                        const atStockLimit = variantAvailable && stockQty > 0 && item.quantity >= stockQty
                        const canIncrease = variantAvailable && (!stockQty || item.quantity < stockQty)
                        
                        const variantImage =
                          item.product.gallery.find(
                            (media) => media.colorId != null && String(media.colorId) === String(item.selectedColorId),
                          ) ?? item.product.gallery[0]
                        const imageUrl = variantImage?.src ?? item.product.images.primary

                        return (
                          <li key={item.id} className="flex gap-4">
                            {/* Square Image */}
                            <div className="relative aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                              <img src={imageUrl} alt={item.product.name} className="h-full w-full object-cover" loading="lazy" />
                              {item.product.isActive === false && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                                  <span className="text-[10px] font-bold text-red-600">Inactive</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-1 flex-col justify-between py-1">
                              <div className="flex justify-between gap-2">
                                <div>
                                  <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                                    {selectedColor && <span className="capitalize">{selectedColor.name}</span>}
                                    {selectedSize && (
                                      <>
                                        <span className="text-gray-300">|</span>
                                        <span className="uppercase">{selectedSize.name}</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {formatCurrency(item.product.price * item.quantity)}
                                </p>
                              </div>

                              <div className="flex items-center justify-between">
                                {/* Quantity Controls */}
                                <div className="flex items-center rounded-full border border-gray-200 bg-white shadow-sm">
                                  <button
                                    type="button"
                                    className="px-2.5 py-1 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    disabled={item.quantity <= 1}
                                  >
                                    &minus;
                                  </button>
                                  <span className="w-4 text-center text-xs font-semibold text-gray-900">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    className="px-2.5 py-1 text-gray-500 hover:text-gray-900 disabled:opacity-30"
                                    onClick={() => {
                                      if (!canIncrease) return
                                      const nextQty = variantAvailable && stockQty > 0
                                          ? Math.min(item.quantity + 1, stockQty)
                                          : item.quantity + 1
                                      updateQuantity(item.id, nextQty)
                                    }}
                                    disabled={!canIncrease}
                                  >
                                    +
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-xs font-medium text-gray-400 underline decoration-gray-300 underline-offset-4 transition hover:text-red-600 hover:decoration-red-200"
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

                {/* Footer - Sticky Bottom */}
                <div className="border-t border-gray-100 bg-white px-4 py-6 sm:px-6">
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Shipping</span>
                      <span className="font-medium text-gray-900">
                        {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                      </span>
                    </div>
                    <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between text-base font-bold text-gray-900">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      disabled={items.length === 0 || hasInactiveItem}
                      onClick={handleCheckout}
                      className="flex w-full items-center justify-center rounded-full bg-black px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                    >
                      Checkout
                    </button>
                    <button
                      type="button"
                      onClick={closeCart}
                      className="flex w-full items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-gray-900 transition hover:border-black hover:text-black"
                    >
                      Continue Shopping
                    </button>
                  </div>
                  
                  <div className="mt-4 text-center space-y-2">
                     {hasInactiveItem && (
                      <p className="text-xs font-medium text-red-600">
                        Please remove inactive products to proceed.
                      </p>
                    )}
                    {!hasInactiveItem && (
                      <p className="text-xs text-gray-500">
                        Free shipping on orders over {freeShippingLabel}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
}