import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

type ConfirmationAddress = {
  label: string
  recipient: string
  phone: string
  street: string
  city: string
  pin: string
  type: string
}

type ConfirmationItem = {
  id: string
  name: string
  quantity: number
  price: number
  image: string
  color?: string
  size?: string
}

type ConfirmationTotals = {
  subtotal: number
  shipping: number
  taxes: number
  total: number
}

type OrderConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  address?: ConfirmationAddress
  items: ConfirmationItem[]
  totals: ConfirmationTotals
  paymentMethod: string
  note?: string
  isPlacingOrder?: boolean
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  address,
  items,
  totals,
  paymentMethod,
  note,
  isPlacingOrder = false,
}: OrderConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-200" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-4 py-10">
          <DialogPanel className="w-full max-w-3xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl shadow-gray-200">
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  Confirm your order
                </DialogTitle>
                <p className="mt-1 text-sm text-gray-600">
                  We will reserve your items and start processing as soon as you confirm.
                </p>
              </div>
              <ShieldCheckIcon className="size-8 text-gray-400" aria-hidden="true" />
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,1fr)]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Items</p>
                  <div className="mt-3 space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                        <div className="size-14 overflow-hidden rounded-lg bg-gray-50">
                          <img src={item.image} alt={item.name} className="size-full object-cover" loading="lazy" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            Qty {item.quantity}
                            {item.size && ` | Size ${item.size}`}
                            {item.color && ` | ${item.color}`}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {address && (
                  <div className="rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Deliver to</p>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900">{address.recipient}</h3>
                    <p className="text-sm text-gray-700">{address.street}</p>
                    <p className="text-sm text-gray-700">
                      {address.city} - {address.pin}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gray-500">
                      {address.label} | {address.type}
                    </p>
                    {address.phone && <p className="mt-1 text-sm text-gray-600">Phone: {address.phone}</p>}
                  </div>
                )}
              </div>

              <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-900 text-white">
                <div className="border-b border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-200">Payment</p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                    <CheckCircleIcon className="size-5" aria-hidden="true" />
                    <span>{paymentMethod}</span>
                  </div>
                  {note && <p className="mt-2 text-xs text-gray-200">Note: {note}</p>}
                </div>
                <div className="p-4 text-sm">
                  <div className="flex items-center justify-between text-gray-100">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">{formatCurrency(totals.subtotal)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-gray-100">
                    <span>Shipping</span>
                    <span className="font-semibold text-white">
                      {totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-gray-100">
                    <span>Taxes</span>
                    <span className="font-semibold text-white">{formatCurrency(totals.taxes)}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>
                <div className="border-t border-white/10 bg-gray-950/30 p-4">
                  <p className="text-xs text-gray-200">
                    You will receive live updates once the order is placed. Payments are secured with end-to-end encryption.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isPlacingOrder}
                      className="flex-1 rounded-full border border-white/30 px-4 py-3 text-sm font-semibold text-white transition hover:border-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Go back
                    </button>
                    <button
                      type="button"
                      onClick={onConfirm}
                      disabled={isPlacingOrder}
                      className="flex-1 rounded-full bg-white px-4 py-3 text-sm font-semibold text-gray-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-70"
                    >
                      {isPlacingOrder ? 'Placing order...' : 'Place order'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
