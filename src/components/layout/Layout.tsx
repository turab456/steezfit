import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'

import ScrollToTop from '../common/ScrollToTop'
import CartLayout from '../../application/Cart/Components/CartLayout'
import WishlistLayout from '../../application/Wishlist/Components/WishlistLayout'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useLenisInstance } from './SmoothScrollProvider'

export default function Layout() {
  const { isOpen: isCartOpen } = useCart()
  const { isOpen: isWishlistOpen } = useWishlist()
  const lenis = useLenisInstance()
  const overlayOpen = isCartOpen || isWishlistOpen

  useEffect(() => {
    if (typeof document === 'undefined') return
    const { body, documentElement } = document
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth

    if (overlayOpen) {
      body.style.overflow = 'hidden'
      documentElement.style.overflow = 'hidden'
      if (scrollbarWidth > 0) {
        body.style.paddingRight = `${scrollbarWidth}px`
      }
    } else {
      body.style.overflow = ''
      documentElement.style.overflow = ''
      body.style.paddingRight = ''
    }

    return () => {
      body.style.overflow = ''
      documentElement.style.overflow = ''
      body.style.paddingRight = ''
    }
  }, [overlayOpen])

  useEffect(() => {
    if (!lenis) return
    if (overlayOpen) {
      lenis.stop()
    } else {
      lenis.start()
    }
  }, [lenis, overlayOpen])

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <WishlistLayout />
      <CartLayout />
      <Outlet />
    </>
  )
}
