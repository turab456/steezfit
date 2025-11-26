import { useEffect, useMemo, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import OrderApi from "../api/OrderApi";
import type { Order } from "../types";
import {
  PhoneIcon,
  ArrowLeftIcon,
  MapPinIcon,
  CreditCardIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
// @ts-ignore
import WritableReviews from "../../Reviews/WritableReviews";
import ConfirmModal from "../../../components/custom/CustomConfirmModal";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const steps = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "--";

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const loadOrder = useCallback(async () => {
    if (!orderId) return;
    try {
      setLoading(true);
      const res = await OrderApi.getById(orderId);
      setOrder(res || null);
    } catch (error) {
      console.error("Failed to load order", error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void loadOrder();
  }, [loadOrder]);

  const activeStep = useMemo(
    () => steps.findIndex((s) => s === order?.status),
    [order]
  );

  const canCancel =
    order &&
    ![
      "PACKED",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "RETURN_REQUESTED",
      "RETURNED",
    ].includes(order.status);

  const handleCancel = async () => {
    if (!orderId || !canCancel) return;
    try {
      setIsCancelling(true);
      setCancelModalOpen(false);
      const updated = await OrderApi.cancel(orderId);
      setOrder(updated);
    } catch (error) {
      alert("Unable to cancel this order. Please try again.");
    } finally {
      setIsCancelling(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  // Not Found State
  if (!order) {
    return (
      <section className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <DocumentTextIcon className="h-6 w-6 text-gray-400" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">
            Order not found
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            We couldn't locate this order. It might not exist or you don't have
            permission to view it.
          </p>
          <div className="mt-6">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <><section className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                {order.status.replace(/_/g, " ")}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {canCancel && (
              <button
                onClick={() => setCancelModalOpen(true)}
                disabled={isCancelling}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:opacity-50"
              >
                {isCancelling ? "Cancelling..." : "Cancel order"}
              </button>
            )}
            <Link
              to="/orders"
              className="group inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-4 w-4 transition group-hover:-translate-x-1" />
              Back to Orders
            </Link>
          </div>
        </header>

        <div className="space-y-6">
          {/* Status Tracker Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Order Status
                </h2>
                <p className="text-sm text-gray-500">
                  Track the progress of your delivery
                </p>
              </div>
              {order.addressPhone && order.status !== "CANCELLED" && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4" />
                  <span>Contact: {order.addressPhone}</span>
                </div>
              )}
            </div>

            {order.status === "CANCELLED" ? (
              <div className="flex items-center justify-center rounded-lg border border-red-100 bg-red-50 px-4 py-8 text-center text-red-700">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.15em]">
                    Order Cancelled
                  </p>
                  <p className="mt-2 text-sm text-red-600">
                    This order was cancelled. No further updates will appear here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-2 rounded-full bg-gray-900 transition-all duration-500"
                    style={{
                      width: `${Math.max(
                        5,
                        ((activeStep + 1) / steps.length) * 100
                      )}%`,
                    }} />
                </div>
                <div className="mt-4 grid grid-cols-5 text-center text-xs font-medium">
                  {steps.map((step, i) => {
                    const isActive = i <= activeStep;
                    return (
                      <div
                        key={step}
                        className={`flex flex-col items-center gap-1 ${isActive ? "text-gray-900" : "text-gray-400"}`}
                      >
                        <span className="hidden sm:block">
                          {step.replace(/_/g, " ")}
                        </span>
                        <span className="block sm:hidden">
                          {step
                            .slice(0, 1)
                            .toUpperCase() +
                            step.slice(1).toLowerCase().replace(/_/g, " ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
              <h3 className="font-semibold text-gray-900">Items</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="h-full w-full object-cover object-center" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        No Img
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        <Link
                          to={`/product/${item.productId}`}
                          className="hover:underline"
                        >
                          {item.productName}
                        </Link>
                      </h4>
                      <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                        <span>Qty: {item.quantity}</span>
                        {item.sizeName && <span>- {item.sizeName}</span>}
                        {item.colorName && <span>- {item.colorName}</span>}
                      </div>
                    </div>
                    <p className="mt-2 font-semibold text-gray-900 sm:mt-0">
                      {currency.format(item.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Section (Conditional) */}
          {order.status === "DELIVERED" && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                How was your order?
              </h2>
              <WritableReviews
                orderId={order.id}
                onReviewSubmitted={loadOrder} />
            </div>
          )}

          {/* Order Details Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Shipping Address */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-gray-900">
                <MapPinIcon className="h-5 w-5" />
                <h3 className="font-semibold">Shipping Address</h3>
              </div>
              <div className="text-sm leading-relaxed text-gray-600">
                <p className="font-medium text-gray-900">{order.addressName}</p>
                <p>{order.addressLine1}</p>
                {order.addressLine2 && <p>{order.addressLine2}</p>}
                <p>
                  {order.city}, {order.state} {order.postalCode}
                </p>
              </div>
            </div>

            {/* Payment Info */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 text-gray-900">
                <CreditCardIcon className="h-5 w-5" />
                <h3 className="font-semibold">Payment Info</h3>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Method
                  </p>
                  <p className="font-medium text-gray-900">
                    {order.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">
                    Status
                  </p>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium capitalize mt-1 ${order.paymentStatus === "paid"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-gray-100 text-gray-700"}`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    {currency.format(order.subtotal)}
                  </span>
                </div>

                {order.discountAmount && order.discountAmount > 0 ? (
                  <div className="flex justify-between text-emerald-700">
                    <span className="flex items-center gap-2">
                      Discount
                      {order.couponCode && (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                          {order.couponCode}
                        </span>
                      )}
                    </span>
                    <span>-{currency.format(order.discountAmount)}</span>
                  </div>
                ) : null}

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {order.shippingFee === 0
                      ? "Free"
                      : currency.format(order.shippingFee)}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>{currency.format(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section><ConfirmModal
        isOpen={cancelModalOpen}
        onCancel={() => {
          if (isCancelling) return;
          setCancelModalOpen(false);
        } }
        onConfirm={handleCancel}
        isProcessing={isCancelling}
        title="Cancel this order?"
        message="If the order is already packed or out for delivery, it cannot be cancelled. Are you sure you want to proceed?"
        confirmText="Yes, cancel"
        cancelText="Keep order" /></>
  );
}
