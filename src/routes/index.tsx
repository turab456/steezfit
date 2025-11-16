

import { Navigate, createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../application/Home'
import ProductDetails from '../application/ProductDetails'
import Shop from '../application/Shop'
import About from '../application/About'
import { AuthProvider } from '../contexts/AuthContext'
import Contact from '../application/Contact'

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

    ],
  },
])
