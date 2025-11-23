import CartLayout from './Components/CartLayout'

const CartPage = () => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        <p className="mt-2 text-sm text-gray-600">Use the cart drawer to review or checkout.</p>
      </div>
      <CartLayout />
    </div>
  )
}

export default CartPage
