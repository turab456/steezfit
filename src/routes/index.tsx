

import { Navigate, createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../application/Home'
import ProductDetails from '../application/ProductDetails'
import Shop from '../application/Shop'
import About from '../application/About'
import Contact from '../application/Contact'
import Checkout from '../application/Checkout'
import OrdersLayout from '../application/Orders'
import AllOrders from '../application/Orders/components/AllOrders'
import OrderDetails from '../application/Orders/components/OrderDetails'
import ProfilePage from '../application/Profile'
import ProtectedRoute from './ProtectedRoute'
import { AuthProvider } from '../contexts/AuthContext'
import { AuthModalProvider } from '../contexts/AuthModalContext'
import { WishlistProvider } from '../contexts/WishlistContext'
import { CartProvider } from '../contexts/CartContext'
import { OrderProvider } from '../contexts/OrderContext'
import { SmoothScrollProvider } from '../components/layout/SmoothScrollProvider'

const Providers = ({ children }: { children: React.ReactNode }) => (
  <SmoothScrollProvider>
    <AuthProvider>
      <AuthModalProvider>
        <WishlistProvider>
          <CartProvider>
            <OrderProvider>{children}</OrderProvider>
          </CartProvider>
        </WishlistProvider>
      </AuthModalProvider>
    </AuthProvider>
  </SmoothScrollProvider>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Providers>
        <Layout />
      </Providers>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'product/:productId',
        element: <ProductDetails />,
      },
      {
        path: 'product',
        element: <Navigate to="/shop" replace />,
      },
      {
        path: 'shop',
        element: <Shop />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <OrdersLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AllOrders /> },
          { path: ':orderId', element: <OrderDetails /> },
        ],
      },
      {
        path: 'myaccount',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },

    ],
  },
])
