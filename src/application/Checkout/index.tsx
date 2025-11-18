import { useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import {  MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { useCart } from '../../contexts/CartContext'
import AddAddressModal from './components/AddAddressModal'
import type { AddressFormState } from './components/AddAddressModal'

type Address = {
  id: string
  label: string
  recipient: string
  phone: string
  street: string
  city: string
  pin: string
  type: 'Home' | 'Office' | 'Other'
  isDefault?: boolean
}

const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    recipient: 'Azeem Khan',
    phone: '+91 91002 33234',
    street: '23 Residency Layout, Indiranagar',
    city: 'Bengaluru, Karnataka',
    pin: '560008',
    type: 'Home',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Studio',
    recipient: 'SteezFit HQ',
    phone: '+91 97412 88990',
    street: '18, 1st Main, Koramangala',
    city: 'Bengaluru, Karnataka',
    pin: '560034',
    type: 'Office',
  },
]

const INITIAL_FORM_STATE: AddressFormState = {
  label: '',
  recipient: '',
  phone: '',
  street: '',
  city: '',
  pin: '',
  type: 'Home',
}

const DEFAULT_LOCATION_IMAGE =
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
const STATIC_MAP_BASE_URL = 'https://staticmap.openstreetmap.de/staticmap.php'

type DetectedLocation = {
  coords: { lat: number; lng: number }
  subtitle: string
  mapUrl: string
  addressLine?: string
  cityLine?: string
  pin?: string
}

function buildStaticMapUrl(lat: number, lng: number) {
  const params = new URLSearchParams({
    center: `${lat},${lng}`,
    zoom: '15',
    size: '600x400',
    maptype: 'mapnik',
    markers: `${lat},${lng},red-pushpin`,
  })
  return `${STATIC_MAP_BASE_URL}?${params.toString()}`
}

async function reverseGeocode(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      { headers: { Accept: 'application/json' } },
    )
    if (!response.ok) return null
    const data = await response.json()
    const address = data.address ?? {}
    const streetLine = [address.road, address.neighbourhood, address.suburb].filter(Boolean).join(', ')
    const settlement = address.city || address.town || address.village || address.state_district
    const cityLine = [settlement, address.state].filter(Boolean).join(', ')
    return {
      streetLine: streetLine || data.display_name,
      cityLine,
      pin: address.postcode,
    }
  } catch {
    return null
  }
}

const AddressBadge = ({ type }: { type: Address['type'] }) => (
  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
    {type}
  </span>
)

export default function Checkout() {
  const { items, subtotal } = useCart()
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES)
  const [selectedAddressId, setSelectedAddressId] = useState(INITIAL_ADDRESSES[0]?.id ?? '')
  const [formState, setFormState] = useState(INITIAL_FORM_STATE)
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false)
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [locationNote, setLocationNote] = useState(
    'Share your live location to get faster delivery updates.',
  )
  const [locationPreview, setLocationPreview] = useState(DEFAULT_LOCATION_IMAGE)
  const [detectedLocation, setDetectedLocation] = useState<DetectedLocation | null>(null)

  const shipping = subtotal === 0 ? 0 : subtotal >= 1999 ? 0 : 89
  const taxes = subtotal * 0.05
  const total = subtotal + shipping + taxes

  const summaryItems = useMemo(
    () =>
      items.map((entry) => ({
        id: entry.id,
        name: entry.product.name,
        quantity: entry.quantity,
        price: entry.product.price,
        color: entry.product.colors.find((color) => color.id === entry.selectedColorId)?.name,
        size: entry.product.sizes.find((size) => size.id === entry.selectedSizeId)?.name,
        image: entry.product.gallery[0]?.src ?? entry.product.images.primary,
      })),
    [items],
  )

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId)

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error')
      setLocationNote("Your browser doesn't support location access.")
      return
    }

    setLocationStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const subtitle = `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`
        const mapUrl = buildStaticMapUrl(latitude, longitude)
        setLocationPreview(mapUrl)
        setDetectedLocation({
          coords: { lat: latitude, lng: longitude },
          subtitle,
          mapUrl,
        })
        setLocationStatus('success')
        setLocationNote('Location detected. You can confirm or edit from the suggestions below.')

        reverseGeocode(latitude, longitude).then((details) => {
          if (!details) return
          setDetectedLocation((prev) =>
            prev
              ? { ...prev, addressLine: details.streetLine, cityLine: details.cityLine, pin: details.pin }
              : null,
          )
          setFormState((prev) => ({
            ...prev,
            label: prev.label || 'Current Location',
            street: prev.street || details.streetLine || '',
            city: prev.city || details.cityLine || '',
            pin: prev.pin || details.pin || '',
          }))
        })
      },
      () => {
        setLocationStatus('error')
        setLocationNote('Unable to fetch your location. Please allow permissions or enter manually.')
        setLocationPreview(DEFAULT_LOCATION_IMAGE)
        setDetectedLocation(null)
      },
      { enableHighAccuracy: true, timeout: 8000 },
    )
  }

  const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.recipient || !formState.street || !formState.city || !formState.pin) {
      setLocationNote('Please complete the highlighted fields to save the address.')
      return
    }

    const newAddress: Address = {
      id: crypto.randomUUID ? crypto.randomUUID() : `addr-${Date.now()}`,
      label: formState.label || `${formState.type} ${addresses.length + 1}`,
      recipient: formState.recipient,
      phone: formState.phone,
      street: formState.street,
      city: formState.city,
      pin: formState.pin,
      type: formState.type,
    }

    setAddresses((prev) => [newAddress, ...prev])
    setSelectedAddressId(newAddress.id)
    setFormState(INITIAL_FORM_STATE)
    setLocationNote('New address saved successfully.')
    setIsAddAddressOpen(false)
  }

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 via-white to-white pb-20 pt-12">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
           
            
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <div className="space-y-8">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">
                      Detect Location
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-gray-900">
                      Share your current location
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">{locationNote}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-200 transition hover:bg-gray-800"
                  >
                    <MapPinIcon className="size-5" />
                    {locationStatus === 'loading' ? 'Detecting…' : 'Use my location'}
                  </button>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={locationPreview}
                        alt="Map preview"
                        className="h-48 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <p className="text-xs uppercase tracking-[0.35em] text-gray-200">Selected Location</p>
                        <p className="text-lg font-semibold">
                          {detectedLocation?.addressLine ?? selectedAddress?.street ?? 'Choose or add address'}
                        </p>
                        <p className="text-sm text-gray-200">
                          {detectedLocation?.cityLine ?? selectedAddress?.city ?? detectedLocation?.subtitle}
                        </p>
                        {detectedLocation?.subtitle && (
                          <p className="text-xs uppercase tracking-[0.35em] text-gray-300">
                            {detectedLocation.subtitle}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-2xl border border-dashed border-gray-200 p-4">
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-1 size-2 rounded-full"
                        style={{
                          backgroundColor:
                            locationStatus === 'success'
                              ? '#10B981'
                              : locationStatus === 'error'
                                ? '#EF4444'
                                : '#9CA3AF',
                        }}
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Live tracking ready</p>
                        <p className="text-xs text-gray-600">
                          Pinpointed locations let our riders validate the exact drop-off before they head out.
                        </p>
                      </div>
                    </div>
                    {detectedLocation && (
                      <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                        <p className="font-semibold">Nearest landmark detected</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">
                          {detectedLocation.subtitle}
                        </p>
                        {detectedLocation.addressLine && (
                          <p className="mt-2 text-xs text-emerald-800">{detectedLocation.addressLine}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-lg shadow-gray-100">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">
                      Saved Places
                    </p>
                    <h2 className="mt-2 text-xl font-semibold text-gray-900">
                      Select a delivery address
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setIsAddAddressOpen(true)}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-900 transition hover:border-gray-900"
                    >
                      + Add Address
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {addresses.map((address) => {
                    const isSelected = selectedAddressId === address.id
                    return (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => setSelectedAddressId(address.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? 'border-gray-900 bg-gray-900/90 text-white shadow-lg'
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                            {address.label}
                          </p>
                          {address.isDefault && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-white text-gray-900'
                              }`}
                            >
                              Default
                            </span>
                          )}
                        </div>
                        <p className={`mt-2 text-base font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {address.recipient}
                        </p>
                        <p className={`mt-1 text-sm ${isSelected ? 'text-gray-100' : 'text-gray-600'}`}>
                          {address.street}
                        </p>
                        <p className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-600'}`}>
                          {address.city} · {address.pin}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <PhoneIcon className={`size-4 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                            <span className={isSelected ? 'text-white' : 'text-gray-700'}>{address.phone}</span>
                          </div>
                          <AddressBadge type={address.type} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6 lg:sticky lg:top-28">
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-100">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">
                  Order Summary
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">Review items & charges</h2>

                <div className="mt-6 space-y-4">
                  {summaryItems.length === 0 && (
                    <p className="text-sm text-gray-500">Your cart is empty. Add items to continue.</p>
                  )}

                  {summaryItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-gray-100 p-3">
                      <div className="h-20 w-20 overflow-hidden rounded-2xl bg-gray-50">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          {item.size && <span>Size {item.size}</span>}
                          {item.size && item.color && ' · '}
                          {item.color && <span>{item.color}</span>}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
                            Qty {item.quantity}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      ₹{subtotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-gray-900">
                      {shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tax & Fees</span>
                    <span className="font-semibold text-gray-900">
                      ₹{taxes.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-base font-semibold text-gray-900">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {selectedAddress && (
                    <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Delivering To</p>
                      <p className="mt-1 font-semibold text-gray-900">{selectedAddress.recipient}</p>
                      <p>{selectedAddress.street}</p>
                      <p className="text-gray-500">
                        {selectedAddress.city} · {selectedAddress.pin}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={!selectedAddress || summaryItems.length === 0}
                    className="flex w-full items-center justify-center rounded-2xl bg-gray-900 px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    Confirm & Pay
                  </button>
                  <p className="text-center text-xs text-gray-500">
                    Secure checkout · Encrypted payment · Instant confirmation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AddAddressModal
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        formState={formState}
        onChange={handleFormChange}
        onSubmit={handleAddAddress}
      />
    </>
  )
}
