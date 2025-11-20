import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SmoothScrollProvider } from './components/layout/SmoothScrollProvider.tsx'
import { CartProvider } from './contexts/CartContext.tsx'
import { WishlistProvider } from './contexts/WishlistContext.tsx'
import { OrderProvider } from './contexts/OrderContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WishlistProvider>
      <CartProvider>
        <OrderProvider>
          <SmoothScrollProvider>
            <App />
          </SmoothScrollProvider>
        </OrderProvider>
      </CartProvider>
    </WishlistProvider>
  </StrictMode>,
)
