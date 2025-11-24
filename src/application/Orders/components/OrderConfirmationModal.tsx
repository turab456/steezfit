import { CustomModal, CustomButton } from '../../../components/custom'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

type ConfirmationAddress = {
  name: string
  phoneNumber?: string | null
  addressLine1: string
  addressLine2?: string | null
  city: string
  state: string
  postalCode?: string | null
  addressType: string
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
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      contentClassName="p-6 lg:p-8 bg-white text-gray-900"
    >
      <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Confirm your order</h2>
          <p className="mt-1 text-sm text-gray-600">
            We will reserve your items and start processing as soon as you confirm.
          </p>
        </div>
       
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
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {address && (
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Deliver to</p>
              <h3 className="mt-1 text-lg font-semibold text-gray-900">{address.name}</h3>
              <p className="text-sm text-gray-700">{address.addressLine1}</p>
              {address.addressLine2 && <p className="text-sm text-gray-700">{address.addressLine2}</p>}
              <p className="text-sm text-gray-700">
                {address.city}, {address.state} - {address.postalCode}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gray-500">{address.addressType}</p>
              {address.phoneNumber && <p className="mt-1 text-sm text-gray-600">Phone: {address.phoneNumber}</p>}
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border border-gray-200 bg-white text-gray-900">
          <div className="border-b border-gray-100 p-4">
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Payment</p>
            <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <CheckCircleIcon className="size-5 text-gray-600" aria-hidden="true" />
              <span>{paymentMethod}</span>
            </div>
            {note && <p className="mt-2 text-xs text-gray-600">Note: {note}</p>}
          </div>
          <div className="p-4 text-sm">
            <div className="flex items-center justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-gray-700">
              <span>Shipping</span>
              <span className="font-semibold text-gray-900">
                {totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}
              </span>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <p className="text-xs text-gray-600">
              You will receive live updates once the order is placed.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <CustomButton
                type="button"
                onClick={onClose}
                disabled={isPlacingOrder}
                variant="outline"
                fullWidth={false}
                className="sm:w-auto"
              >
                Go back
              </CustomButton>
              <CustomButton
                type="button"
                onClick={onConfirm}
                disabled={isPlacingOrder}
                fullWidth={false}
                className="sm:w-auto"
              >
                {isPlacingOrder ? 'Placing order...' : 'Place order'}
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}
