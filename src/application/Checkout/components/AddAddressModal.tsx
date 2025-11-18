import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import type { ChangeEvent, FormEvent } from 'react'

export type AddressFormState = {
  label: string
  recipient: string
  phone: string
  street: string
  city: string
  pin: string
  type: 'Home' | 'Office' | 'Other'
}

type AddAddressModalProps = {
  isOpen: boolean
  onClose: () => void
  formState: AddressFormState
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const fieldWrapper = 'flex flex-col gap-2'
const labelClass =
  'text-xs font-semibold uppercase tracking-[0.35em] text-gray-500'
const inputClass =
  'w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10'

export default function AddAddressModal({
  isOpen,
  onClose,
  formState,
  onChange,
  onSubmit,
}: AddAddressModalProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-200" />
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-4 py-8">
          <DialogPanel className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl shadow-gray-200">
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
              
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  Add Address
                </DialogTitle>
                <p className="mt-1 text-sm text-gray-600">
                  Fill the details below to pin a new delivery location.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:border-gray-900 hover:text-gray-900"
              >
                <span className="sr-only">Close</span>
                ×
              </button>
            </div>

            <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
              <div className={fieldWrapper}>
                <label className={labelClass}>Label</label>
                <input
                  type="text"
                  name="label"
                  value={formState.label}
                  onChange={onChange}
                  placeholder="E.g., Parents, Studio"
                  className={inputClass}
                />
              </div>
              <div className={fieldWrapper}>
                <label className={labelClass}>Recipient</label>
                <input
                  type="text"
                  name="recipient"
                  value={formState.recipient}
                  onChange={onChange}
                  placeholder="Full name"
                  className={inputClass}
                  required
                />
              </div>
              <div className={fieldWrapper}>
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formState.phone}
                  onChange={onChange}
                  placeholder="+91"
                  className={inputClass}
                />
              </div>
              <div className={fieldWrapper}>
                <label className={labelClass}>Pincode</label>
                <input
                  type="text"
                  name="pin"
                  value={formState.pin}
                  onChange={onChange}
                  maxLength={6}
                  placeholder="560001"
                  className={inputClass}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Street & Landmark</label>
                <input
                  type="text"
                  name="street"
                  value={formState.street}
                  onChange={onChange}
                  placeholder="Apartment, Street, Nearby Landmark"
                  className={inputClass}
                  required
                />
              </div>
              <div className={fieldWrapper}>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formState.city}
                  onChange={onChange}
                  placeholder="City, State"
                  className={inputClass}
                  required
                />
              </div>
              <div className={fieldWrapper}>
                <label className={labelClass}>Address Type</label>
                <select
                  name="type"
                  value={formState.type}
                  onChange={onChange}
                  className={inputClass}
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-gray-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white  transition hover:bg-gray-800"
                >
                  Save Address
                </button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}

