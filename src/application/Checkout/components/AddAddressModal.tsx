import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import type { ChangeEvent, FormEvent } from 'react'
import type { AddressType } from '../address'

export type AddressFormState = {
  name: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  addressType: AddressType
  isDefault: boolean
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
          <DialogPanel className="w-full max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 ">
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  Add Address
                </DialogTitle>
                <p className="mt-1 text-sm text-gray-600">
                  We currently deliver only within Bengaluru, Karnataka.
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
                <label className={labelClass}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={onChange}
                  placeholder="Recipient name"
                  className={inputClass}
                  required
                />
              </div>
              <div className={fieldWrapper}>
                <label className={labelClass}>Phone</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formState.phoneNumber}
                  onChange={onChange}
                  placeholder="+91"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formState.addressLine1}
                  onChange={onChange}
                  placeholder="Apartment, Street, Landmark"
                  className={inputClass}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Address Line 2 (optional)</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formState.addressLine2}
                  onChange={onChange}
                  placeholder="Nearby building, area"
                  className={inputClass}
                />
              </div>
              <div className={fieldWrapper}>
                <label className={labelClass}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formState.city}
                  onChange={onChange}
                  placeholder="Bengaluru"
                  className={inputClass}
                  required
                />
              </div>
              <div className={fieldWrapper}>
                <label className={labelClass}>State</label>
                <input
                  type="text"
                  name="state"
                  value={formState.state}
                  onChange={onChange}
                  placeholder="Karnataka"
                  className={inputClass}
                  required
                />
              </div>
              <div className={fieldWrapper}>
                <label className={labelClass}>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formState.postalCode}
                  onChange={onChange}
                  maxLength={10}
                  placeholder="560001"
                  className={inputClass}
                />
              </div>
              <div className={fieldWrapper}>
                <label className={labelClass}>Address Type</label>
                <select
                  name="addressType"
                  value={formState.addressType}
                  onChange={onChange}
                  className={inputClass}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formState.isDefault}
                  onChange={onChange}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label className="text-sm font-semibold text-gray-800">
                  Set as default address
                </label>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-gray-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-gray-800"
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
