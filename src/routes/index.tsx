

import { Navigate, createBrowserRouter } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Home from '../application/Home'
import ProductDetails from '../application/ProductDetails'
import Shop from '../application/Shop'
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
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
    ],
  },
])
