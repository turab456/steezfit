import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import OrderApi from "../api/OrderApi";
import type { Order } from "../types";
import { PhoneIcon } from "@heroicons/react/24/outline";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const steps = ["PLACED", "CONFIRMED", "PACKED", "OUT_FOR_DELIVERY", "DELIVERED"] as const;

const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "—";

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;
    OrderApi.getById(orderId).then((res) => setOrder(res || null));
  }, [orderId]);

  const activeStep = useMemo(
    () => steps.findIndex((s) => s === order?.status),
    [order]
  );

  if (!order) {
    return (
      <section className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-8xl px-4 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Order not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            We could not locate this order. Please check the link or return to your orders page.
          </p>
          <div className="mt-6">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-gray-800"
            >
              Back to orders
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Order #{order.id}</h1>
            <p className="text-sm text-gray-600">
              Order placed {formatDate(order.createdAt)}
            </p>
          </div>
          <Link
            to="/orders"
            className="text-sm font-semibold text-indigo-700 hover:text-indigo-900"
          >
            Back to orders
          </Link>
        </header>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Status</p>
                <p className="text-sm font-semibold text-gray-900">{order.status.replace(/_/g, " ")}</p>
              </div>
              <div className="text-sm text-gray-700">
                <div className="flex items-center gap-2">
                  <PhoneIcon className="h-4 w-4" />
                  <span>{order.addressPhone || "N/A"}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Expected updates
              </div>
              <div className="relative h-2 rounded-full bg-gray-100">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-indigo-600"
                  style={{
                    width: `${Math.max(1, ((activeStep ?? 0) + 1) / steps.length * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs font-semibold text-gray-700">
                {steps.map((step, i) => (
                  <span key={step} className={i <= (activeStep ?? 0) ? "text-indigo-700" : "text-gray-500"}>
                    {step.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="grid gap-4 px-6 py-5 sm:grid-cols-3 sm:items-start">
                  <div className="flex items-start gap-4 sm:col-span-2">
                    <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-50">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-semibold text-gray-900">{item.productName}</h3>
                      <p className="text-xs text-gray-600">
                        Qty {item.quantity}
                        {item.sizeName && ` • ${item.sizeName}`}
                        {item.colorName && ` • ${item.colorName}`}
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {currency.format(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Delivery to</p>
                    <p className="font-semibold text-gray-900">{order.addressName}</p>
                    <p>{order.addressLine1}</p>
                    {order.addressLine2 && <p>{order.addressLine2}</p>}
                    <p>
                      {order.city}, {order.state} {order.postalCode || ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Billing address</p>
              <p className="text-sm font-semibold text-gray-900">{order.addressName}</p>
              <p className="text-sm text-gray-700">{order.addressLine1}</p>
              {order.addressLine2 && <p className="text-sm text-gray-700">{order.addressLine2}</p>}
              <p className="text-sm text-gray-700">
                {order.city}, {order.state} {order.postalCode || ""}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                Payment information
              </p>
              <p className="text-sm font-semibold text-gray-900">{order.paymentMethod}</p>
              <p className="text-sm text-gray-700 capitalize">{order.paymentStatus}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Summary</p>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {currency.format(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {order.shippingFee === 0 ? "Free" : currency.format(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-semibold text-gray-900">
                <span>Order total</span>
                <span>{currency.format(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
