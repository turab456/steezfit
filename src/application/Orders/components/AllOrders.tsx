import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { OrderApi } from "../api/OrderApi";
import type { Order } from "../types";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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
                  <p className="mt-1 font-semibold text-gray-900">{order.number}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Date placed</p>
                  <p className="mt-1 font-semibold text-gray-900">{formatDate(order.datePlaced)}</p>
                </div>
                <div className="flex flex-wrap justify-between gap-3 sm:justify-end sm:gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Total amount</p>
                    <p className="mt-1 font-semibold text-gray-900">{currency.format(order.total)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/orders/${order.id}`}
                      className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
                    >
                      View Order
                    </Link>
                    <button className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900">
                      View Invoice
                    </button>
                  </div>
                </div>
              </div>

              {order.items.map((item) => (
                <div key={item.id} className="border-t border-gray-100 px-6 py-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
                    <div className="h-28 w-28 overflow-hidden rounded-xl bg-gray-50">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                          <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          {currency.format(item.price * item.quantity)}
                        </p>
                      </div>
                      <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <CheckCircleIcon className="h-5 w-5" />
                        Delivered on {order.deliveryDate ? formatDate(order.deliveryDate) : "—"}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 text-sm font-semibold text-indigo-700">
                      <Link to={`/product/${item.id}`} className="hover:underline">
                        View product
                      </Link>
                      <button className="text-left hover:underline">Buy again</button>
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
