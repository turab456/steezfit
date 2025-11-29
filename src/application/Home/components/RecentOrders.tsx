'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OrderApi from '../../Orders/api/OrderApi'
import type { Order } from '../../Orders/types'
import { useAuth } from '../../../contexts/AuthContext'

export default function RecentOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  // If auth is initializing or the user is not authenticated, don't render this widget
  if (authLoading) return null
  if (!isAuthenticated) return null

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      // If auth is still initializing or user is not authenticated, don't call API
      if (authLoading) return
      if (!isAuthenticated) return

      setLoading(true)
      try {
        const data = await OrderApi.recent()
        if (!cancelled) setOrders(data ?? [])
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

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="p-4 rounded-lg bg-white shadow">
          <p className="text-sm text-gray-500">Loading recent orders…</p>
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
      <div className="p-4 rounded-lg bg-white shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Recent Orders</h3>
        <button
          className="text-xs text-gray-500 underline"
          onClick={() => navigate('/orders')}
        >
          View all
        </button>
      </div>

      <ul className="mt-3 space-y-3">
        {orders.map((order) => (
          <li key={order.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-md bg-gray-50">
                <img
                  src={order.items?.[0]?.imageUrl ?? ''}
                  alt={order.items?.[0]?.productName ?? 'Order item'}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {order.items?.map((it) => it.productName).filter(Boolean).slice(0, 2).join(', ')}
                </p>
                <p className="text-xs text-gray-500">{order.status ?? 'PLACED'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/orders/${order.id}`)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-900 hover:bg-gray-50"
              >
                View
              </button>
            </div>
          </li>
        ))}
      </ul>
      </div>
    </div>
  )
}
