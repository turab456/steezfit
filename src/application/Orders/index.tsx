import {
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  TruckIcon,
} from '@heroicons/react/24/outline'
import { Link, useLocation, useParams } from 'react-router-dom'
import type { Order } from '../../contexts/OrderContext'
import { useOrders } from '../../contexts/OrderContext'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function formatDate(value?: string) {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

const timeline = [
  { key: 'Processing', title: 'Processing', description: 'Order is being confirmed.' },
  { key: 'Packed', title: 'Packed', description: 'Items are packed and ready to ship.' },
  { key: 'Shipped', title: 'Shipped', description: 'Courier has picked up your package.' },
  { key: 'Delivered', title: 'Delivered', description: 'Package delivered to you.' },
] satisfies Array<{ key: Order['status']; title: string; description: string }>

export default function OrderDetails() {
  const { orderId } = useParams()
  const { findOrderById } = useOrders()
  const location = useLocation()

  const orderFromState = (location.state as { order?: Order } | null)?.order
  const order = (orderId && findOrderById(orderId)) || orderFromState

  if (!order) {
    return (
      <section className="bg-gradient-to-b from-gray-50 via-white to-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <ExclamationTriangleIcon className="size-7" aria-hidden="true" />
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-gray-900">Order not found</h1>
          <p className="mt-2 text-sm text-gray-600">
            We could not find the order you were looking for. Please check the link or place a new order.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
            >
              Go Home
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const activeIndex = Math.max(
    0,
    timeline.findIndex((step) => step.key === order.status),
  )

  return (
    <section className="bg-gradient-to-b from-gray-50 via-white to-white pb-16 pt-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-xl shadow-gray-100 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">
                Order confirmed
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">#{order.id}</h1>
              <p className="text-sm text-gray-600">
                Placed on {formatDate(order.placedAt)}
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-4 py-2 font-semibold text-emerald-700">
                <CheckCircleIcon className="size-5" aria-hidden="true" />
                {order.status}
              </div>
              {order.expectedDelivery && (
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  ETA {formatDate(order.expectedDelivery)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center gap-3">
                  <ClockIcon className="size-6 text-gray-500" aria-hidden="true" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Status</p>
                    <h2 className="text-lg font-semibold text-gray-900">Track your order</h2>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-4">
                  {timeline.map((step, index) => {
                    const isComplete = index <= activeIndex
                    const isCurrent = index === activeIndex
                    return (
                      <div
                        key={step.key}
                        className={`flex flex-col gap-2 rounded-xl border p-3 ${
                          isComplete
                            ? 'border-emerald-100 bg-emerald-50'
                            : 'border-dashed border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          {isComplete ? (
                            <CheckCircleIcon className="size-5 text-emerald-600" aria-hidden="true" />
                          ) : (
                            <ClockIcon className="size-5 text-gray-400" aria-hidden="true" />
                          )}
                          <span className={isCurrent ? 'text-emerald-700' : 'text-gray-800'}>
                            {step.title}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{step.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TruckIcon className="size-6 text-gray-500" aria-hidden="true" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Delivering To</p>
                      <h2 className="text-lg font-semibold text-gray-900">{order.address.recipient}</h2>
                    </div>
                  </div>
                  <div className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gray-700">
                    {order.address.type}
                  </div>
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                    <p className="font-semibold">Address</p>
                    <p className="mt-1 text-gray-600">{order.address.street}</p>
                    <p className="text-gray-600">
                      {order.address.city} - {order.address.pin}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.3em] text-gray-500">
                      {order.address.label}
                    </p>
                  </div>
                  <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                    <p className="font-semibold">Contact</p>
                    <p className="mt-1 text-gray-600">{order.address.phone || 'N/A'}</p>
                    {order.notes && <p className="mt-2 text-gray-600">Note: {order.notes}</p>}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-500">Items</p>
                <div className="mt-4 space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 rounded-xl border border-gray-100 p-3"
                    >
                      <div className="size-16 overflow-hidden rounded-lg bg-gray-50">
                        <img src={item.image} alt={item.name} className="size-full object-cover" loading="lazy" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          Qty {item.quantity}
                          {item.size && ` • Size ${item.size}`}
                          {item.color && ` • ${item.color}`}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-200 bg-gray-900 text-white">
                <div className="border-b border-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-gray-200">Payment</p>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold">
                    <CreditCardIcon className="size-5" aria-hidden="true" />
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>
                <div className="p-4 text-sm">
                  <div className="flex items-center justify-between text-gray-100">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-gray-100">
                    <span>Shipping</span>
                    <span className="font-semibold text-white">{formatCurrency(order.shipping)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-gray-100">
                    <span>Taxes</span>
                    <span className="font-semibold text-white">{formatCurrency(order.taxes)}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <HomeIcon className="size-5 text-gray-500" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-gray-900">Need help?</p>
                    <p className="text-gray-600">Chat with support if you need to change delivery instructions.</p>
                    <div className="mt-3 flex gap-2">
                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-gray-800"
                      >
                        Contact Us
                      </Link>
                      <Link
                        to="/shop"
                        className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-800 transition hover:border-gray-900 hover:text-gray-900"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
