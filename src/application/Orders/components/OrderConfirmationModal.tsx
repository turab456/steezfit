import { CustomModal, CustomButton } from '../../../components/custom'
import { CheckCircleIcon, MapPinIcon, CreditCardIcon } from '@heroicons/react/24/outline'

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
  discount?: number
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
  couponCode?: string | null
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
  couponCode,
  note,
  isPlacingOrder = false,
}: OrderConfirmationModalProps) {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      contentClassName="p-0 bg-white text-gray-900 overflow-hidden flex flex-col max-h-[90vh]"
    >
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-6 py-5">
        <h2 className="text-xl font-bold text-gray-900">Confirm Order</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please review your details before finalizing.
        </p>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          
          {/* Left Column: Items & Address */}
          <div className="space-y-8">
            
            {/* Delivery Address Card */}
            {address && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <MapPinIcon className="h-5 w-5 text-gray-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                    Delivery Location
                  </h3>
                </div>
                <div className="pl-7">
                  <p className="font-semibold text-gray-900">{address.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{address.addressLine1}</p>
                  {address.addressLine2 && <p className="text-sm text-gray-600">{address.addressLine2}</p>}
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} - <span className="font-medium text-gray-900">{address.postalCode}</span>
                  </p>
                  <div className="mt-3 flex gap-3 text-xs">
                    <span className="rounded bg-white px-2 py-1 font-medium text-gray-600 shadow-sm border border-gray-100">
                      {address.addressType}
                    </span>
                    {address.phoneNumber && (
                      <span className="flex items-center text-gray-500">
                        Ph: {address.phoneNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Items Section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  Items ({items.reduce((acc, item) => acc + item.quantity, 0)})
                </h3>
              </div>
              
              {/* Scrollable Container for Items */}
              <div className="max-h-[320px] overflow-y-auto pr-2 space-y-3 no-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-3 transition hover:border-gray-200">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover" 
                        loading="lazy" 
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</p>
                        <p className="text-sm font-bold text-gray-900 whitespace-nowrap">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                         <span className="font-medium bg-gray-50 px-1.5 py-0.5 rounded text-gray-600">Qty: {item.quantity}</span>
                         {item.size && <span>Size: {item.size}</span>}
                         {item.color && <span>Color: {item.color}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Payment & Totals (Sticky on Desktop) */}
          <div className="lg:sticky lg:top-0 h-fit space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-4">
                <CreditCardIcon className="h-5 w-5 text-gray-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  Payment Details
                </h3>
              </div>
              
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 text-sm font-medium text-gray-900">
                <CheckCircleIcon className="h-5 w-5 text-emerald-600" />
                {paymentMethod}
              </div>
              
              {note && (
                <div className="mt-3 rounded-lg border border-dashed border-gray-200 p-3 text-xs text-gray-600">
                  <span className="font-semibold text-gray-900">Note:</span> {note}
                </div>
              )}

              <div className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(totals.subtotal)}</span>
                </div>
                
                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span className="flex items-center gap-2">
                      <span>Discount</span>
                      {couponCode && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                          {couponCode}
                        </span>
                      )}
                    </span>
                    <span className="font-semibold">-{formatCurrency(totals.discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {totals.shipping === 0 ? 'Free' : formatCurrency(totals.shipping)}
                  </span>
                </div>
                
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <span>Total Amount</span>
                    <span>{formatCurrency(totals.total)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Desktop Action Buttons (Hidden on Mobile if preferred, or keep duplicates) */}
             <div className="hidden lg:block space-y-3">
               <CustomButton
                  fullWidth
                  onClick={onConfirm}
                  disabled={isPlacingOrder}
                  className="bg-black py-3.5 text-sm font-bold uppercase tracking-widest text-white hover:bg-gray-800"
                >
                  {isPlacingOrder ? 'Processing...' : 'Confirm Order'}
                </CustomButton>
                <button 
                  onClick={onClose} 
                  disabled={isPlacingOrder}
                  className="w-full text-xs font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-50"
                >
                  Cancel and go back
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Footer Actions */}
      <div className="block lg:hidden border-t border-gray-100 bg-white p-4">
        <div className="flex gap-3">
           <CustomButton
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isPlacingOrder}
            className="w-1/3 border-gray-200"
          >
            Back
          </CustomButton>
          <CustomButton
            fullWidth
            onClick={onConfirm}
            disabled={isPlacingOrder}
            className="w-2/3 bg-black font-bold uppercase tracking-wide"
          >
            {isPlacingOrder ? 'Processing...' : 'Place Order'}
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  )
}
