import { useMemo } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { CustomModal, CustomInput, CustomDropdown, CustomButton, CustomCheckbox } from '../../../components/custom'
import type { AddressType } from '../types'

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
  error?: string
  onDetectLocation?: () => void
  locationStatus?: 'idle' | 'loading' | 'success' | 'error'
}

export default function AddAddressModal({
  isOpen,
  onClose,
  formState,
  onChange,
  onSubmit,
  error,
  onDetectLocation,
  locationStatus = 'idle',
}: AddAddressModalProps) {
  const phoneValue = useMemo(() => {
    return formState.phoneNumber.replace(/^\+91\s?/, '')
  }, [formState.phoneNumber])

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      overlayClassName="bg-black/20"
      contentClassName="p-6 bg-white text-gray-900 max-h-[80vh] overflow-y-auto no-scrollbar"
    >
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">Add Address</h3>
          <p className="mt-1 text-sm text-gray-600">We deliver only within Bengaluru, Karnataka.</p>
        </div>
        
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <CustomInput
          label="Full Name"
          name="name"
          value={formState.name}
          onChange={onChange}
          placeholder="Recipient name"
          required
        />

        <CustomInput
          label="Phone Number"
          type="tel"
          name="phoneNumber"
          value={phoneValue}
          onChange={(e) =>
            onChange({
              ...e,
              target: {
                ...e.target,
                name: 'phoneNumber',
                value: `+91 ${e.target.value}`,
              },
            } as any)
          }
          placeholder="Enter 10-digit phone number"
          required
          maxLength={10}
        />

        <CustomInput
          className="md:col-span-2"
          label="Address Line 1"
          name="addressLine1"
          value={formState.addressLine1}
          onChange={onChange}
          placeholder="Apartment, Street, Landmark"
          required
        />
        <CustomInput
          className="md:col-span-2"
          label="Address Line 2 (optional)"
          name="addressLine2"
          value={formState.addressLine2}
          onChange={onChange}
          placeholder="Nearby building, area"
        />

        <CustomInput label="City" name="city" value="Bengaluru" onChange={() => {}} disabled />
        <CustomInput label="State" name="state" value="Karnataka" onChange={() => {}} disabled />

        <CustomInput
          label="Postal Code"
          name="postalCode"
          value={formState.postalCode}
          onChange={onChange}
          maxLength={6}
          placeholder="Enter Your Postal Code"
          required
        />

        <CustomDropdown
          label="Address Type"
          name="addressType"
          value={formState.addressType}
          onChange={onChange}
          options={[
            { label: 'Home', value: 'home' },
            { label: 'Work', value: 'work' },
            { label: 'Other', value: 'other' },
          ]}
        />

        <div className="md:col-span-2">
          <CustomCheckbox
            name="isDefault"
            checked={formState.isDefault}
            onChange={onChange as any}
            className='text-black'
            label="Set as default address"
          />
        </div>

        <div className="md:col-span-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          {onDetectLocation && (
            <CustomButton
              type="button"
              fullWidth={false}
              variant="outline"
              onClick={onDetectLocation}
              disabled={locationStatus === 'loading'}
              className="w-full sm:w-auto"
            >
              {locationStatus === 'loading' ? 'Detecting…' : 'Use my location'}
            </CustomButton>
          )}
          <CustomButton type="submit" fullWidth={false} className="w-full sm:w-auto">
            Save Address
          </CustomButton>
          
        </div>
      </form>
    </CustomModal>
  )
}
