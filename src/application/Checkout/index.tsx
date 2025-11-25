import {
  useMemo,
  useState,
  useEffect,
  useCallback,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { PhoneIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useCart } from "../../contexts/CartContext";
import type { Order } from "../Orders/types";
import AddAddressModal from "./components/AddAddressModal";
import OrderConfirmationModal from "../Orders/components/OrderConfirmationModal";
import OrderSuccessModal from "../Orders/components/OrderSuccessModal";
import type { AddressFormState } from "./components/AddAddressModal";
import AddressService from "./api/AddressApi";
import type { Address, CouponValidation, AvailableCoupon } from "../Checkout/types";
import OrderApi from "../Orders/api/OrderApi";
import CouponApi from "./api/CouponApi";

type SummaryItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  color?: string;
  size?: string;
  image: string;
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

const INITIAL_FORM_STATE: AddressFormState = {
  name: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "Bengaluru",
  state: "Karnataka",
  postalCode: "",
  addressType: "home",
  isDefault: false,
};

async function reverseGeocode(lat: number, lng: number) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      { headers: { Accept: "application/json" } }
    );
    if (!response.ok) return null;
    const data = await response.json();
    const address = data.address ?? {};
    const streetLine = [address.road, address.neighbourhood, address.suburb]
      .filter(Boolean)
      .join(", ");
    const settlement =
      address.city || address.town || address.village || address.state_district;
    const cityLine = [settlement, address.state].filter(Boolean).join(", ");
    return {
      streetLine: streetLine || data.display_name,
      cityLine,
      pin: address.postcode,
    };
  } catch {
    return null;
  }
}

const AddressBadge = ({ type }: { type: Address["addressType"] }) => (
  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
    {type}
  </span>
);

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, ] = useState("Card on delivery");
  const [locationStatus, setLocationStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [addressError, setAddressError] = useState<string | undefined>(undefined);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [shippingSetting, setShippingSetting] = useState({ freeShippingThreshold: 1999, shippingFee: 0 });
  const [couponCode, setCouponCode] = useState("");
  const [couponState, setCouponState] = useState<CouponValidation | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  const numericSubtotal = Number(subtotal || 0);
  const numericThreshold = Number(shippingSetting.freeShippingThreshold || 0);
  const numericShippingFee = Number(shippingSetting.shippingFee || 0);
  const shipping =
    numericSubtotal === 0
      ? 0
      : numericSubtotal >= numericThreshold
      ? 0
      : numericShippingFee;
  const discountValue = couponState?.discountAmount ? Number(couponState.discountAmount) || 0 : 0;
  const discount = couponState?.discountAmount ? Math.min(discountValue, numericSubtotal) : 0;
  const total = Math.max(0, numericSubtotal - discount) + shipping;

  const summaryItems = useMemo<SummaryItem[]>(() => {
    return items.map((entry) => ({
      id: String(entry.id),
      name: entry.product.name,
      quantity: entry.quantity,
      price: entry.product.price,
      color: entry.product.colors.find(
        (color) => String(color.id) === String(entry.selectedColorId ?? "")
      )?.name,
      size: entry.product.sizes.find(
        (size) => String(size.id) === String(entry.selectedSizeId ?? "")
      )?.name,
      image:
        entry.product.gallery.find(
          (media) =>
            media.colorId != null &&
            String(media.colorId) === String(entry.selectedColorId ?? "")
        )?.src ||
        entry.product.gallery[0]?.src ||
        entry.product.images.primary,
    }));
  }, [items]);

  const selectedAddress = addresses.find(
    (address) => address.id === selectedAddressId
  );

  const handleOpenConfirmation = () => {
    if (!selectedAddress || summaryItems.length === 0) return;
    setIsConfirmOpen(true);
  };

  const handleCreateOrder = async () => {
    if (!selectedAddress || summaryItems.length === 0) return;
    setIsPlacingOrder(true);

    try {
      const order = await OrderApi.create(selectedAddress.id, couponState?.code);
      handleRemoveCoupon();
      await fetchAvailableCoupons();
      clearCart();
      setIsConfirmOpen(false);
      setPlacedOrder(order);
      setIsSuccessOpen(true);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleApplyCoupon = async (codeInput?: string) => {
    const codeToUse = (codeInput ?? couponCode).trim();
    if (!codeToUse) {
      setCouponError("Enter a coupon code.");
      return;
    }
    if (subtotal <= 0) {
      setCouponError("Add items to cart before applying a coupon.");
      return;
    }
    setIsApplyingCoupon(true);
    setCouponError(null);
    try {
      const validation = await CouponApi.validate(codeToUse, numericSubtotal);
      setCouponState({
        ...validation,
        discountAmount: Number(validation.discountAmount) || 0,
      });
      toast.success(validation.message || "Coupon applied.");
    } catch (error: any) {
      console.error("Coupon validation failed:", error);
      const message =
        error?.data?.message ||
        error?.message ||
        "Unable to apply coupon. Please try another code.";
      setCouponError(message);
      setCouponState(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponState(null);
    setCouponCode("");
    setCouponError(null);
  };

  const fetchAvailableCoupons = useCallback(async () => {
    setIsLoadingCoupons(true);
    try {
      const data = await CouponApi.listAvailable();
      setAvailableCoupons(data || []);
    } catch (error) {
      console.error("Failed to load coupons:", error);
      setAvailableCoupons([]);
    } finally {
      setIsLoadingCoupons(false);
    }
  }, []);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      toast.error("Your browser doesn't support location access.");
      return;
    }

    setLocationStatus("loading");
    setAddressError(undefined);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        reverseGeocode(latitude, longitude).then((details) => {
          if (!details) {
            setLocationStatus("error");
            toast.error("Unable to detect address from location.");
            return;
          }

          const isBlr = (details.cityLine || "").toLowerCase().includes("bengaluru");
          if (!isBlr) {
            setLocationStatus("error");
            setAddressError("Currently we deliver only within Bengaluru.");
            toast.error("Detected location is outside Bengaluru.");
            return;
          }

          setFormState((prev) => ({
            ...prev,
            name: prev.name || "Delivery Contact",
            addressLine1: prev.addressLine1 || details.streetLine || "",
            city: "Bengaluru",
            state: prev.state || "Karnataka",
            postalCode: prev.postalCode || details.pin || "",
          }));
          setLocationStatus("success");
          toast.success("Location detected and applied to the form.");
        });
      },
      () => {
        setLocationStatus("error");
        toast.error("Unable to fetch your location. Please allow permissions or enter manually.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleFormChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = "checked" in event.target ? event.target.checked : false;
    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const fetchAddresses = async () => {
    try {
      const data = await AddressService.list();
      setAddresses(data || []);
      if (data?.length) {
        const defaultAddr = data.find((addr) => addr.isDefault);
        setSelectedAddressId(defaultAddr?.id || data[0].id);
      } else {
        setSelectedAddressId("");
      }
    } catch (error: any) {
      console.error("Fetch addresses failed:", error);
      toast.error(error?.message || "Failed to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);
  useEffect(() => {
    OrderApi.getShippingSetting()
      .then((setting) =>
        setShippingSetting(
          setting ?? { freeShippingThreshold: 1999, shippingFee: 0 },
        ),
      )
      .catch(() => setShippingSetting({ freeShippingThreshold: 1999, shippingFee: 0 }));
  }, []);
  useEffect(() => {
    fetchAvailableCoupons();
  }, [fetchAvailableCoupons]);
  useEffect(() => {
    if (!couponState) return;
    if (subtotal === 0) {
      setCouponState(null);
      return;
    }
    // Revalidate discount when cart value changes
    CouponApi.validate(couponState.code, numericSubtotal)
      .then((res) =>
        setCouponState({
          ...res,
          discountAmount: Number(res.discountAmount) || 0,
        }),
      )
      .catch(() => {
        setCouponState(null);
        setCouponError("Coupon no longer valid for this cart total.");
      });
  }, [couponState?.code, numericSubtotal]);

  const handleAddAddress = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name || !formState.addressLine1 || !formState.city) {
      toast.error("Please complete the highlighted fields to save the address.")
      return;
    }

    try {
      const payload = {
        ...formState,
      };
      const newAddress = await AddressService.create(payload);
      toast.success("Address saved");
      const nextAddresses = [
        newAddress,
        ...addresses.filter((a) => a.id !== newAddress.id),
      ];
      setAddresses(nextAddresses);
      setSelectedAddressId(newAddress.id);
      setFormState(INITIAL_FORM_STATE);
      toast.success("New address saved successfully.");
      setIsAddAddressOpen(false);
    } catch (error: any) {
      console.error("Add address error:", error);
      toast.error(error?.message || "Failed to save address (Bengaluru only).");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const updated = await AddressService.setDefault(id);
      await fetchAddresses();
      setSelectedAddressId(updated.id);
      toast.success("Default address updated");
    } catch (error: any) {
      console.error("Set default error:", error);
      toast.error(error?.message || "Failed to update default address");
    }
  };

  return (
    <>
      <section className="bg-gradient-to-b from-gray-50 via-white to-white pb-20 pt-12 min-h-screen overflow-y-auto no-scrollbar">
        <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4"></div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
            <div className="space-y-8">
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
                    const isSelected = selectedAddressId === address.id;
                    return (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => setSelectedAddressId(address.id)}
                        className={`w-full rounded-2xl border p-4 text-left transition ${
                          isSelected
                            ? "border-gray-900 bg-gray-900/90 text-white shadow-lg"
                            : "border-gray-200 bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-sm font-semibold ${
                              isSelected ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {address.addressType}
                          </p>
                          {address.isDefault && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-white text-gray-900"
                              }`}
                            >
                              Default
                            </span>
                          )}
                        </div>
                        <p
                          className={`mt-2 text-base font-semibold ${
                            isSelected ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {address.name}
                        </p>
                        <p
                          className={`mt-1 text-sm ${
                            isSelected ? "text-gray-100" : "text-gray-600"
                          }`}
                        >
                          {address.addressLine1}
                        </p>
                        {address.addressLine2 && (
                          <p
                            className={`text-sm ${
                              isSelected ? "text-gray-200" : "text-gray-600"
                            }`}
                          >
                            {address.addressLine2}
                          </p>
                        )}
                        <p
                          className={`text-sm ${
                            isSelected ? "text-gray-200" : "text-gray-600"
                          }`}
                        >
                          {address.city}, {address.state} |{" "}
                          {address.postalCode || ""}
                        </p>
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <PhoneIcon
                              className={`size-4 ${
                                isSelected ? "text-white" : "text-gray-500"
                              }`}
                            />
                            <span
                              className={
                                isSelected ? "text-white" : "text-gray-700"
                              }
                            >
                              {address.phoneNumber || "N/A"}
                            </span>
                          </div>
                          <AddressBadge type={address.addressType} />
                        </div>
                        {!address.isDefault && (
                          <div className="mt-3 text-right">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetDefault(address.id);
                              }}
                              className={`text-xs font-semibold ${
                                isSelected ? "text-white" : "text-gray-700"
                              } underline`}
                            >
                              Set as default
                            </button>
                          </div>
                        )}
                      </button>
                    );
                  })}
                  {addresses.length === 0 && (
                    <p className="text-sm text-gray-600">
                      No saved addresses. Add one to proceed with delivery
                      (Bengaluru only).
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
                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  Review items & charges
                </h2>

                <div className="mt-6 space-y-4">
                  {summaryItems.length === 0 && (
                    <p className="text-sm text-gray-500">
                      Your cart is empty. Add items to continue.
                    </p>
                  )}

                  {summaryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-2xl border border-gray-100 p-3"
                    >
                      <div className="h-20 w-20 overflow-hidden rounded-2xl bg-gray-50">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.size && <span>Size {item.size}</span>}
                          {item.size && item.color && " | "}
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
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span className="flex items-center gap-2">
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                          Coupon {couponState?.code}
                        </span>
                        <span>Discount</span>
                      </span>
                      <span className="font-semibold">
                        -{formatCurrency(discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-gray-900">
                      {shipping === 0 ? "Free" : formatCurrency(shipping)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-base font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-gray-900">
                    <span>Have a coupon?</span>
                    {couponState?.code && (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs uppercase tracking-[0.25em] text-emerald-700">
                        Applied
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError(null);
                      }}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-gray-900 outline-none transition focus:border-gray-900"
                    />
                    <button
                      type="button"
                      onClick={couponState ? handleRemoveCoupon : handleApplyCoupon}
                      disabled={isApplyingCoupon || subtotal === 0}
                      className="flex items-center justify-center rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
                    >
                      {couponState ? "Remove" : isApplyingCoupon ? "Applying..." : "Apply"}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-600">{couponError}</p>
                  )}
                {couponState?.message && !couponError && (
                  <p className="text-xs text-emerald-700">{couponState.message}</p>
                )}

                  <div className="mt-3 rounded-xl bg-white p-3 shadow-sm">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-gray-600">
                      <span>Available Coupons</span>
                      {isLoadingCoupons && <span className="text-[10px] font-normal text-gray-500">Loading...</span>}
                    </div>
                    {availableCoupons.length === 0 && !isLoadingCoupons && (
                      <p className="text-xs text-gray-500">No coupons available right now.</p>
                    )}
                    <div className="space-y-2">
                      {availableCoupons.map((coupon) => (
                        <button
                          key={coupon.id}
                          type="button"
                          onClick={() => {
                            const nextCode = coupon.code.toUpperCase();
                            setCouponCode(nextCode);
                            setCouponError(null);
                            handleApplyCoupon(nextCode);
                          }}
                          className="flex w-full items-center justify-between rounded-lg border border-gray-200 px-3 py-2 text-left transition hover:border-gray-900"
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900 uppercase tracking-[0.2em]">
                              {coupon.code}
                            </span>
                            <span className="text-xs text-gray-600">
                              {coupon.discountType === "PERCENT"
                                ? `${coupon.discountValue}% off`
                                : `Flat ₹${coupon.discountValue} off`}
                            </span>
                            {coupon.minOrderAmount ? (
                              <span className="text-[11px] text-gray-500">
                                Min order ₹{coupon.minOrderAmount}
                              </span>
                            ) : null}
                          </div>
                          <span className="text-[11px] font-semibold text-indigo-700">Apply</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {selectedAddress && (
                    <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700">
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">
                        Delivering To
                      </p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {selectedAddress.name}
                      </p>
                      <p>{selectedAddress.addressLine1}</p>
                      {selectedAddress.addressLine2 && (
                        <p>{selectedAddress.addressLine2}</p>
                      )}
                      <p className="text-gray-500">
                        {selectedAddress.city}, {selectedAddress.state} |{" "}
                        {selectedAddress.postalCode}
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
                    We are currently delivering in Bengaluru only | Cash on
                    Delivery (COD)
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
        error={addressError}
        onDetectLocation={handleUseCurrentLocation}
        locationStatus={locationStatus}
      />
      <OrderConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleCreateOrder}
        address={selectedAddress}
        items={summaryItems}
        totals={{ subtotal, shipping, discount, total }}
        couponCode={couponState?.code}
        paymentMethod={paymentMethod}
        isPlacingOrder={isPlacingOrder}
      />
      <OrderSuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        orderId={placedOrder?.id}
        onContinue={() => {
          setIsSuccessOpen(false);
          navigate('/shop');
        }}
        onViewOrder={() => {
          if (placedOrder) {
            setIsSuccessOpen(false);
            navigate(`/orders/${placedOrder.id}`, { state: { order: placedOrder } });
          }
        }}
      />
    </>
  );
}
