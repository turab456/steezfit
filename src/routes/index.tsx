

import { Navigate, createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import HomePage from '../pages/HomePage'
import ProductPage from '../pages/ProductPage'
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
import ComingSoon from '../components/common/ComingSoon'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import Terms from '../pages/Terms'
// import { SmoothScrollProvider } from '../components/layout/SmoothScrollProvider'

const Providers = ({ children }: { children: React.ReactNode }) => (
  // <SmoothScrollProvider>
  <AuthProvider>
    <AuthModalProvider>
      <WishlistProvider>
        <CartProvider>
          <OrderProvider>{children}</OrderProvider>
        </CartProvider>
      </WishlistProvider>
    </AuthModalProvider>
  </AuthProvider>
  // </SmoothScrollProvider>
)

export const routes: RouteObject[] = [
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
        element: <HomePage />,
      },
      {
        path: 'product/:productId',
        element: <ProductPage />,
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
        path: 'women',
        element: <ComingSoon />,
      },
      {
        path: 'accessories',
        element: <ComingSoon />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
      {
        path: 'coming-soon',
        element: <ComingSoon />,
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
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },

    ],
  },
]

export const router = createBrowserRouter(routes)
