

import { createBrowserRouter } from 'react-router-dom'
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
        path: 'product',
        element: <ProductDetails />,
      },
      {
        path: 'shop',
        element: <Shop />,
      },
    ],
  },
])
