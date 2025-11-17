import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'
import ScrollToTopButton from '../common/ScrollToTopButton'
import ScrollToTop from '../common/ScrollToTop'
import CartLayout from '../../application/Cart/Components/CartLayout'
import WishlistLayout from '../../application/Wishlist/Components/WishlistLayout'

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <WishlistLayout />
      <CartLayout />
      <Outlet />
      <ScrollToTopButton />
    </>
  )
}
