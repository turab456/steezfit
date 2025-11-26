import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OrderApi from "../api/OrderApi";
import type { Order } from "../types";
import {
  CheckCircleIcon,
  ShoppingBagIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Currency Formatter
const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

// Date Formatter
const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

export default function AllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OrderApi.list()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Your Orders
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Check the status of recent orders, manage returns, and discover similar products.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-10 space-y-8">
          {/* Empty State */}
          {orders.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
              <ShoppingBagIcon className="h-16 w-16 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No orders yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start shopping to see your orders here.
              </p>
              <Link
                to="/shop"
                className="mt-6 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Go to Shop &rarr;
              </Link>
            </div>
          )}

          {/* Orders List */}
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Order Header / Summary */}
              <div className="flex flex-col gap-4 border-b border-gray-100 bg-gray-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-6">
                  <div>
                    <p className="text-xs font-medium text-gray-500">Order ID</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Date Placed</p>
                    <p className="mt-0.5 text-sm font-medium text-gray-900">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">Total Amount</p>
                    <p className="mt-0.5 text-sm font-bold text-gray-900">
                      {currency.format(order.total)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span className="capitalize">
                      {order.status.replace(/_/g, " ").toLowerCase()}
                    </span>
                  </div>
                  
                  {/* Clean "View Details" button replacing the old blue links */}
                  <Link
                    to={`/orders/${order.id}`}
                    className="flex items-center gap-1 text-sm font-medium text-gray-600 transition hover:text-gray-900"
                  >
                    View Details
                    <ChevronRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-6 p-6">
                    {/* Image Area - Clickable */}
                    <Link
                      to={`/product/${item.productId}`}
                      className="group relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-100"
                    >
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                          No Img
                        </div>
                      )}
                    </Link>

                    {/* Item Details */}
                    <div className="flex flex-1 flex-col justify-between sm:flex-row sm:items-start">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          <Link
                            to={`/product/${item.productId}`}
                            className="hover:underline"
                          >
                            {item.productName}
                          </Link>
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          <span>Qty {item.quantity}</span>
                          {item.sizeName && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                              <span>{item.sizeName}</span>
                            </>
                          )}
                          {item.colorName && (
                            <>
                              <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                              <span>{item.colorName}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <p className="mt-2 text-sm font-semibold text-gray-900 sm:mt-0">
                        {currency.format(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}