import { CheckCircleIcon } from '@heroicons/react/24/outline'
import CustomButton from '../../../components/custom/CustomButton'

type OrderSuccessModalProps = {
  isOpen: boolean
  onClose: () => void
  orderId?: string
  onViewOrder?: () => void
  onContinue?: () => void
}

const OrderSuccessModal = ({
  isOpen,
  onClose,
  orderId,
  onViewOrder,
  onContinue,
}: OrderSuccessModalProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-6 text-gray-900 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600"
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircleIcon className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900">Order placed successfully</h3>
            <p className="text-sm text-gray-600">
              {orderId ? `Order ID: ${orderId}` : 'Thank you for your purchase.'}
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            {onContinue && (
              <CustomButton fullWidth className="sm:w-auto" onClick={onContinue}>
                Continue shopping
              </CustomButton>
            )}
            {onViewOrder && (
              <CustomButton
                variant="outline"
                fullWidth
                className="sm:w-auto"
                onClick={onViewOrder}
              >
                View order
              </CustomButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccessModal
