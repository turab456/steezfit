

import { Navigate, createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../application/Home'
import ProductDetails from '../application/ProductDetails'
import Shop from '../application/Shop'
import About from '../application/About'
import { AuthProvider } from '../contexts/AuthContext'
import Contact from '../application/Contact'
import Checkout from '../application/Checkout'
import OrdersLayout from '../application/Orders'
import AllOrders from '../application/Orders/components/AllOrders'
import OrderDetails from '../application/Orders/components/OrderDetails'
import ProfilePage from '../application/Profile'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
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
        element: <Checkout />,
      },
      {
        path: 'orders',
        element: <OrdersLayout />,
        children: [
          { index: true, element: <AllOrders /> },
          { path: ':orderId', element: <OrderDetails /> },
        ],
      },
      {
        path: 'myaccount',
        element: <ProfilePage />,
      },

    ],
  },
])
