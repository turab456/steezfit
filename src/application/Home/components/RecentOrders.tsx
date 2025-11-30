'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OrderApi from '../../Orders/api/OrderApi'
import type { Order } from '../../Orders/types'
import { useAuth } from '../../../contexts/AuthContext'
import Loader from '../../../components/common/Loader'

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  const STATUS_STEPS: Order['status'][] = [
    'PLACED',
    'CONFIRMED',
    'PACKED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ]

  const getActiveStep = (status: Order['status']) => {
    const idx = STATUS_STEPS.indexOf(status)
    return idx >= 0 ? idx : 0
  }

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      // If auth is still initializing or user is not authenticated, don't call API
      if (authLoading) return
      if (!isAuthenticated) return

      setLoading(true)
      try {
        const data = await OrderApi.recent()
        if (!cancelled) {
          const sorted = (data ?? []).slice().sort((a, b) => {
            const aDate = a.createdAt ? Date.parse(a.createdAt) : 0
            const bDate = b.createdAt ? Date.parse(b.createdAt) : 0
            return bDate - aDate
          })
          setOrders(sorted.slice(0, 1))
        }
      } catch (err) {
        console.error('Failed to load recent orders', err)
        if (!cancelled) setOrders([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated])

  // If auth is initializing or the user is not authenticated, don't render this widget
  if (authLoading) return null
  if (!isAuthenticated) return null

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-lg bg-white p-4 shadow">
          <Loader />
        </div>
      </div>
    )
  }

  // If there are no recent orders, render nothing so the homepage layout remains clean
  if (!orders || orders.length === 0) {
    return null
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">Recent Order</p>
          </div>
          <button
            className="text-xs font-semibold text-gray-600 underline underline-offset-4"
            onClick={() => navigate('/orders')}
          >
            View all
          </button>
        </div>

        {orders.map((order) => {
          const firstItem = order.items?.[0]
          const title =
            order.items?.map((it) => it.productName).filter(Boolean).slice(0, 2).join(', ') ||
            'Order items'
          const activeStep = getActiveStep(order.status)

          if (order.status === 'CANCELLED') {
            return (
              <div key={order.id} className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-md bg-white/70">
                      <img
                        src={firstItem?.imageUrl ?? ''}
                        alt={firstItem?.productName ?? 'Order item'}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="text-xs font-medium text-red-600">Order cancelled</p>
                      <p className="text-[11px] text-gray-500">#{order.id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-red-600 shadow-sm ring-1 ring-red-200 hover:bg-red-100"
                  >
                    Details
                  </button>
                </div>
              </div>
            )
          }

          return (
            <div
              key={order.id}
              className="mt-4 rounded-lg border border-gray-100 bg-gradient-to-br from-gray-50 to-white px-4 py-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-gray-200">
                    <img
                      src={firstItem?.imageUrl ?? ''}
                      alt={firstItem?.productName ?? 'Order item'}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{title}</p>
                    <p className="text-xs text-gray-500">Order #{order.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                >
                  View
                </button>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  <span>{STATUS_STEPS[0]}</span>
                  <span>{STATUS_STEPS[STATUS_STEPS.length - 1]}</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {STATUS_STEPS.map((step, idx) => {
                    const isActive = idx <= activeStep
                    const isCurrent = idx === activeStep
                    const isLast = idx === STATUS_STEPS.length - 1
                    return (
                      <div key={step} className="flex flex-1 items-center last:flex-none">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${
                            isActive
                              ? 'bg-black text-white'
                              : 'bg-gray-100 text-gray-400 ring-1 ring-gray-200'
                          } ${isCurrent ? 'ring-2 ring-offset-2 ring-offset-white ring-black/40' : ''}`}
                        >
                          <span className="sr-only">{step}</span>
                          {isActive ? '✓' : ''}
                        </div>
                        {!isLast && (
                          <div
                            className={`mx-1 h-1 flex-1 rounded-full ${
                              isActive ? 'bg-black' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  <span className="font-semibold text-gray-900">Current status:</span>{' '}
                  {order.status.replace(/_/g, ' ')}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
