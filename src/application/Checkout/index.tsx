import { useMemo, useState, useEffect, type ChangeEvent, type FormEvent } from 'react'
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCart } from '../../contexts/CartContext'
import { useOrders } from '../../contexts/OrderContext'
import AddAddressModal from './components/AddAddressModal'
import OrderConfirmationModal from '../Orders/components/OrderConfirmationModal'
import type { AddressFormState } from './components/AddAddressModal'
import AddressService from './api/AddressApi'
import type { Address } from './address'

type SummaryItem = {
  id: string
  name: string
  quantity: number
  price: number
  color?: string
  size?: string
  image: string
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

const INITIAL_FORM_STATE: AddressFormState = {
  name: '',
  phoneNumber: '',
  addressLine1: '',
  addressLine2: '',
  city: 'Bengaluru',
  state: 'Karnataka',
  postalCode: '',
  addressType: 'home',
  isDefault: false,
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

const AddressBadge = ({ type }: { type: Address['addressType'] }) => (
  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
    {type}
  </span>
)

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const { createOrder } = useOrders()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [formState, setFormState] = useState(INITIAL_FORM_STATE)
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Card on delivery')
  const [orderNote, setOrderNote] = useState('')
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [locationNote, setLocationNote] = useState(
    'Share your live location to get faster delivery updates.',
  )
  const [locationPreview, setLocationPreview] = useState(DEFAULT_LOCATION_IMAGE)
  const [detectedLocation, setDetectedLocation] = useState<DetectedLocation | null>(null)

  const shipping = subtotal === 0 ? 0 : subtotal >= 1999 ? 0 : 89
  const taxes = Math.round(subtotal * 0.05)
  const total = subtotal + shipping + taxes

  const summaryItems = useMemo<SummaryItem[]>(() => {
    return items.map((entry) => ({
      id: entry.id,
      name: entry.product.name,
      quantity: entry.quantity,
      price: entry.product.price,
      color: entry.product.colors.find((color) => color.id === entry.selectedColorId)?.name,
      size: entry.product.sizes.find((size) => size.id === entry.selectedSizeId)?.name,
      image: entry.product.gallery[0]?.src ?? entry.product.images.primary,
    }))
  }, [items])

  const selectedAddress = addresses.find((address) => address.id === selectedAddressId)

  const handleOpenConfirmation = () => {
    if (!selectedAddress || summaryItems.length === 0) return
    setIsConfirmOpen(true)
  }

  const handleCreateOrder = () => {
    if (!selectedAddress || summaryItems.length === 0) return
    setIsPlacingOrder(true)

    try {
      const order = createOrder({
        items: summaryItems,
        totals: { subtotal, shipping, taxes, total },
        address: {
          label: selectedAddress.addressType,
          recipient: selectedAddress.name,
          phone: selectedAddress.phoneNumber || '',
          street: selectedAddress.addressLine1,
          city: selectedAddress.city,
          state: selectedAddress.state,
          postalCode: selectedAddress.postalCode || ''
        },
        paymentMethod,
        notes: orderNote.trim() || undefined,
      })

      clearCart()
      setIsConfirmOpen(false)
      navigate(`/orders/${order.id}`, { state: { order } })
    } finally {
      setIsPlacingOrder(false)
    }
  }

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
            name: prev.name || 'Delivery Contact',
            addressLine1: prev.addressLine1 || details.streetLine || '',
            city: prev.city || (details.cityLine || 'Bengaluru'),
            state: prev.state || 'Karnataka',
            postalCode: prev.postalCode || details.pin || '',
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
    const { name, value, type } = event.target
    const checked = 'checked' in event.target ? event.target.checked : false
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const fetchAddresses = async () => {
    try {
      const data = await AddressService.list()
      setAddresses(data || [])
      if (data?.length) {
        const defaultAddr = data.find((addr) => addr.isDefault)
        setSelectedAddressId(defaultAddr?.id || data[0].id)
      } else {
        setSelectedAddressId('')
      }
    } catch (error: any) {
      console.error('Fetch addresses failed:', error)
      toast.error(error?.message || 'Failed to load addresses')
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleAddAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formState.name || !formState.addressLine1 || !formState.city) {
      setLocationNote('Please complete the highlighted fields to save the address.')
      return
    }

    try {
      const payload = {
        ...formState,
      }
      const newAddress = await AddressService.create(payload)
      toast.success('Address saved')
      const nextAddresses = [newAddress, ...addresses.filter((a) => a.id !== newAddress.id)]
      setAddresses(nextAddresses)
      setSelectedAddressId(newAddress.id)
      setFormState(INITIAL_FORM_STATE)
      setLocationNote('New address saved successfully.')
      setIsAddAddressOpen(false)
    } catch (error: any) {
      console.error('Add address error:', error)
      toast.error(error?.message || 'Failed to save address (Bengaluru only).')
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const updated = await AddressService.setDefault(id)
      await fetchAddresses()
      setSelectedAddressId(updated.id)
      toast.success('Default address updated')
    } catch (error: any) {
      console.error('Set default error:', error)
      toast.error(error?.message || 'Failed to update default address')
    }
  }

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 via-white to-white pb-20 pt-12">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">Checkout</p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">Delivery & payments</h1>
              <p className="text-sm text-gray-600">
                Confirm your address, location, and payment method before placing the order.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
              <p className="font-semibold text-gray-900 text-right">{summaryItems.length} item(s)</p>
              <p>{formatCurrency(total)}</p>
            </div>
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
                    {locationStatus === 'loading' ? 'Detecting...' : 'Use my location'}
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
                          {detectedLocation?.addressLine ?? selectedAddress?.addressLine1 ?? 'Choose or add address'}
                        </p>
                        <p className="text-sm text-gray-200">
                          {detectedLocation?.cityLine ?? (selectedAddress ? `${selectedAddress.city}, ${selectedAddress.state}` : detectedLocation?.subtitle)}
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
                            {address.addressType}
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
                          {address.name}
                        </p>
                        <p className={`mt-1 text-sm ${isSelected ? 'text-gray-100' : 'text-gray-600'}`}>
                          {address.addressLine1}
                        </p>
                        {address.addressLine2 && (
                          <p className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-600'}`}>
                            {address.addressLine2}
                          </p>
                        )}
                        <p className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-600'}`}>
                          {address.city}, {address.state} | {address.postalCode || ''}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <PhoneIcon className={`size-4 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                            <span className={isSelected ? 'text-white' : 'text-gray-700'}>{address.phoneNumber || 'N/A'}</span>
                          </div>
                          <AddressBadge type={address.addressType} />
                        </div>
                        {!address.isDefault && (
                          <div className="mt-3 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleSetDefault(address.id)
                              }}
                              className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-gray-700'} underline`}
                            >
                              Set as default
                            </button>
                          </div>
                        )}
                      </button>
                    )
                  })}
                  {addresses.length === 0 && (
                    <p className="text-sm text-gray-600">
                      No saved addresses. Add one to proceed with delivery (Bengaluru only).
                    </p>
                  )}
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
                          {item.size && item.color && ' | '}
                          {item.color && <span>{item.color}</span>}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
                            Qty {item.quantity}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-gray-900">
                      {shipping === 0 ? 'Free' : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tax & Fees</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(taxes)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-base font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="grid gap-3 text-sm">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
                        Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(event) => setPaymentMethod(event.target.value)}
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                      >
                        <option value="Card on delivery">Card on delivery</option>
                        <option value="UPI / Wallet">UPI / Wallet</option>
                        <option value="Net banking">Net banking</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">
                        Delivery Note (optional)
                      </label>
                      <input
                        type="text"
                        value={orderNote}
                        onChange={(event) => setOrderNote(event.target.value)}
                        placeholder="Add a short instruction for the rider"
                        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                      />
                    </div>
                  </div>

                  {selectedAddress && (
                    <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Delivering To</p>
                      <p className="mt-1 font-semibold text-gray-900">{selectedAddress.name}</p>
                      <p>{selectedAddress.addressLine1}</p>
                      {selectedAddress.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
                      <p className="text-gray-500">
                        {selectedAddress.city}, {selectedAddress.state} | {selectedAddress.postalCode}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={!selectedAddress || summaryItems.length === 0}
                    onClick={handleOpenConfirmation}
                    className="flex w-full items-center justify-center rounded-2xl bg-gray-900 px-6 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    Confirm & Pay
                  </button>
                  <p className="text-center text-xs text-gray-500">
                    Secure checkout | Encrypted payment | Instant confirmation
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
      <OrderConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleCreateOrder}
        address={selectedAddress}
        items={summaryItems}
        totals={{ subtotal, shipping, taxes, total }}
        paymentMethod={paymentMethod}
        note={orderNote}
        isPlacingOrder={isPlacingOrder}
      />
    </>
  )
}
