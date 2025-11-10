import { Outlet } from 'react-router-dom'
import Navbar from '../common/Navbar'
import CartLayout from '../../application/Cart/Components/CartLayout'
import WishlistLayout from '../../application/Wishlist/Components/WishlistLayout'

export default function Layout() {
  return (
    <>
      <Navbar />
      <WishlistLayout />
      <CartLayout />
      <Outlet />
    </>
  )
}
