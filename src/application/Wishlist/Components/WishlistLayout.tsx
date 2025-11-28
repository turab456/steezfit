// 'use client'

// import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
// import { ShoppingCartIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
// import { Link } from 'react-router-dom'
// import { useCart } from '../../../contexts/CartContext'
// import { useWishlist } from '../../../contexts/WishlistContext'

// const currencyFormatter = new Intl.NumberFormat('en-IN', {
//   style: 'currency',
//   currency: 'INR',
//   maximumFractionDigits: 0,
// })

// function formatCurrency(value: number) {
//   return currencyFormatter.format(value)
// }

// export default function WishlistLayout() {
//   const { items, isOpen, closeWishlist, removeFromWishlist } = useWishlist()
//   const { addToCart, openCart } = useCart()

//   return (
//     <Dialog open={isOpen} onClose={closeWishlist} className="relative z-50">
//       <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" />

//       <div className="fixed inset-0 overflow-hidden">
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
//             <DialogPanel className="pointer-events-auto w-screen max-w-md">
//               <div className="flex h-full flex-col  bg-white shadow-2xl ring-1 ring-black/5">
//                 <div className="flex items-center justify-between border-b border-gray-200 px-4 py-5">
//                   <DialogTitle className="text-lg font-semibold text-gray-900">Wishlist</DialogTitle>
//                   <button
//                     type="button"
//                     onClick={closeWishlist}
//                     className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
//                   >
//                     <span className="sr-only">Close wishlist</span>
//                     <XMarkIcon className="size-6" aria-hidden="true" />
//                   </button>
//                 </div>

//                 <div className="flex-1 overflow-y-auto px-4 py-6">
//                   {items.length === 0 ? (
//                     <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
//                       <p className="text-sm font-semibold uppercase tracking-[0.4em] text-gray-500">Empty</p>
//                       <p className="text-lg font-semibold text-gray-900">Save your favorite looks here.</p>
//                       <p className="text-sm text-gray-500">
//                         Tap the heart icon on any product to keep it handy for later.
//                       </p>
//                     </div>
//                   ) : (
//                     <ul role="list" className="space-y-6 pb-8">
//                       {items.map((item) => {
//                         const imageUrl = item.gallery[0]?.src ?? item.images.primary
//                         const isInactive = item.isActive === false
//                         return (
//                           <li key={item.id} className="flex flex-col gap-3 rounded-2xl border border-gray-100 p-3 shadow-sm shadow-gray-100 sm:flex-row">
//                             <div className="size-20 h-20 w-20 overflow-hidden rounded-2xl bg-gray-100">
//                               <img src={imageUrl} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
//                             </div>
//                             <div className="flex flex-1 flex-col justify-between gap-1 text-sm text-gray-600">
//                               <Link to={`/product/${item.id}`} className="text-base font-semibold text-gray-900">
//                                 {item.name}
//                               </Link>
                            
//                               <div className="flex items-center gap-2">
//                                 <p className="text-sm text-gray-900">{formatCurrency(item.price)}</p>
//                                 {isInactive && (
//                                   <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
//                                     Out of stock
//                                   </span>
//                                 )}
//                               </div>
//                               <div className="flex gap-2 text-gray-500">
//                                 <button
//                                   type="button"
//                                   onClick={() => removeFromWishlist(item.id)}
//                                   className="rounded-full border border-transparent p-2 text-gray-500 transition hover:text-gray-900 hover:border-gray-300"
//                                 >
//                                   <span className="sr-only">Remove from wishlist</span>
//                                   <TrashIcon className="h-4 w-4" aria-hidden="true" />
//                                 </button>
//                                 <button
//                                   type="button"
//                                   disabled={isInactive}
//                                   onClick={() => {
//                                     const defaultColor = item.colors[0]?.id?.toString()
//                                     const defaultSize =
//                                       item.sizes.find((size) => size.inStock)?.id?.toString() ?? item.sizes[0]?.id?.toString() ?? ''
//                                     const added = addToCart(item, {
//                                       colorId: defaultColor,
//                                       sizeId: defaultSize,
//                                       quantity: 1,
//                                     })
//                                     if (added) {
//                                       openCart()
//                                     }
//                                   }}
//                                   className="rounded-full border border-transparent p-2 text-gray-500 transition hover:text-gray-900 hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
//                                 >
//                                   <span className="sr-only">Add wishlist item to cart</span>
//                                   <ShoppingCartIcon className="h-4 w-4" aria-hidden="true" />
//                                 </button>
//                               </div>
//                             </div>
//                           </li>
//                         )
//                       })}
//                     </ul>
//                   )}
//                 </div>

//                 {items.length > 0 && (
//                   <div className="border-t border-gray-200 px-4 py-6">
//                     <Link
//                       to="/shop"
//                       className="flex w-full items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
//                     >
//                       Shop new arrivals
//                     </Link>
//                   </div>
//                 )}
//               </div>
//             </DialogPanel>
//           </div>
//         </div>
//       </div>
//     </Dialog>
//   )
// }
'use client'

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ShoppingCartIcon, TrashIcon, XMarkIcon, HeartIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useWishlist } from '../../../contexts/WishlistContext'
import { useCart } from '../../../contexts/CartContext'

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
            {/* Reverted to your exact original size classes */}
            <DialogPanel className="pointer-events-auto w-screen max-w-md">
              <div className="flex h-full flex-col bg-white shadow-xl">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-5 sm:px-6">
                  <DialogTitle className="text-lg font-semibold text-gray-900">
                    Wishlist 
                    <span className="ml-2 text-sm font-normal text-gray-500">({items.length})</span>
                  </DialogTitle>
                  <button
                    type="button"
                    onClick={closeWishlist}
                    className="relative -m-2 rounded-md p-2 text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <div className="mb-4 rounded-full bg-gray-50 p-4">
                        <HeartIcon className="h-8 w-8 text-gray-300" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900">Your wishlist is empty</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Save items you want to see again here.
                      </p>
                    </div>
                  ) : (
                    <ul role="list" className="space-y-6">
                      {items.map((item) => {
                        const imageUrl = item.gallery[0]?.src ?? item.images.primary
                        const isInactive = item.isActive === false
                        return (
                          <li key={item.id} className="flex flex-col gap-4 sm:flex-row sm:items-start">
                            {/* Square Image Container */}
                            <div className="relative aspect-square h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                              <img 
                                src={imageUrl} 
                                alt={item.name} 
                                className="h-full w-full object-cover object-center" 
                                loading="lazy" 
                              />
                              {isInactive && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-900">Sold Out</span>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-1 flex-col justify-between space-y-2">
                              <div>
                                <div className="flex justify-between">
                                  <Link to={`/product/${item.id}`} onClick={closeWishlist} className="text-base font-medium text-gray-900 hover:text-gray-600">
                                    {item.name}
                                  </Link>
                                </div>
                                <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.price)}</p>
                              </div>

                              <div className="flex items-center gap-3 pt-1">
                                <button
                                  type="button"
                                  disabled={isInactive}
                                  onClick={() => {
                                    const defaultColor = item.colors[0]?.id?.toString()
                                    const defaultSize =
                                      item.sizes.find((size) => size.inStock)?.id?.toString() ?? item.sizes[0]?.id?.toString() ?? ''
                                    const added = addToCart(item, {
                                      colorId: defaultColor,
                                      sizeId: defaultSize,
                                      quantity: 1,
                                    })
                                    if (added) {
                                      openCart()
                                    }
                                  }}
                                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-200"
                                >
                                  <ShoppingCartIcon className="h-3 w-3" />
                                  Add to Cart
                                </button>

                                <button
                                  type="button"
                                  onClick={() => removeFromWishlist(item.id)}
                                  className="group flex items-center justify-center rounded-full border border-gray-200 p-2 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                >
                                  <TrashIcon className="h-4 w-4" aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                  <div className="border-t border-gray-100 bg-white px-4 py-6 sm:px-6">
                    <Link
                      to="/shop"
                      onClick={closeWishlist}
                      className="flex w-full items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold uppercase tracking-widest text-gray-900 transition hover:border-black hover:bg-black hover:text-white"
                    >
                      Shop New Arrivals
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