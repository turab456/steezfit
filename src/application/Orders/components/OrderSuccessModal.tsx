import { CheckCircleIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'
import CustomButton from '../../../components/custom/CustomButton'

type OrderSuccessModalProps = {
  isOpen: boolean
  onClose: () => void // Kept for type compatibility, but not used for direct closing anymore
  orderId?: string
  onViewOrder?: () => void
  onContinue?: () => void
}

const OrderSuccessModal = ({
  isOpen,
  orderId,
  onViewOrder,
  onContinue,
}: OrderSuccessModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center overflow-y-auto overflow-x-hidden p-4 sm:p-6">
      {/* Backdrop - No onClick handler here, so clicking outside won't close it */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-sm transform overflow-hidden rounded-3xl bg-white p-8 text-center shadow-2xl transition-all sm:max-w-md">
        
        {/* Success Animation/Icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/50">
          <CheckCircleIcon className="h-12 w-12 text-emerald-600" />
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Thank You!
          </h2>
          
          <div className="space-y-2">
            <p className="text-base text-gray-500">
              Your order has been placed successfully.
            </p>
            <p className="text-sm text-gray-400">
              We've sent a confirmation email with details.
            </p>
          </div>

          {/* Order ID Badge */}
          {orderId && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Order ID
              </span>
              <span className="font-mono text-sm font-bold text-gray-900">
                #{orderId}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row-reverse">
          {onViewOrder && (
            <CustomButton
              fullWidth
              onClick={onViewOrder}
              className="bg-black text-white hover:bg-gray-800"
            >
              Track Order
            </CustomButton>
          )}
          
          {onContinue && (
            <CustomButton
              variant="outline"
              fullWidth
              onClick={onContinue}
              className="border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900"
            >
              Continue Shopping
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessModal