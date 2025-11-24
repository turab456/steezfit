import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderApi from "../api/OrderApi";
import type { Order } from "../types";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const formatDate = (date?: string) =>
  date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    OrderApi.list().then(setOrders);
  }, []);

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
              Order history
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-gray-900">Your orders</h1>
          </div>
          <Link
            to="/shop"
            className="rounded-full border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
          >
            Continue shopping
          </Link>
        </div>

        <div className="mt-6 space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="grid gap-4 border-b border-gray-100 px-6 py-4 text-sm text-gray-700 sm:grid-cols-3 sm:items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Order number</p>
                  <p className="mt-1 font-semibold text-gray-900">{order.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Date placed</p>
                  <p className="mt-1 font-semibold text-gray-900">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex flex-wrap justify-between gap-3 sm:justify-end sm:gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Total amount</p>
                    <p className="mt-1 font-semibold text-gray-900">{currency.format(order.total)}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>{order.status.replace(/_/g, " ")}</span>
                  </div>
                </div>
              </div>

              {order.items.map((item) => (
                <div key={item.id} className="border-t border-gray-100 px-6 py-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                    <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-50">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{item.productName}</h3>
                          <p className="mt-1 text-xs text-gray-600">
                            Qty {item.quantity}
                            {item.sizeName && ` • ${item.sizeName}`}
                            {item.colorName && ` • ${item.colorName}`}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {currency.format(item.totalPrice)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm font-semibold text-indigo-700">
                      <Link to={`/orders/${order.id}`} className="hover:underline">
                        View order
                      </Link>
                      <Link to={`/product/${item.productId}`} className="hover:underline">
                        View product
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
