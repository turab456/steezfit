'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  PopoverGroup,
} from '@headlessui/react'
import {
  Bars3Icon,
  ChevronDownIcon,
  HeartIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useAuthModal } from '../../contexts/AuthModalContext'
import { useAuth } from '../../contexts/AuthContext'

// 1. Removed the 'Men' object from categories
const navigation = {
  categories: [], 
  pages: [
    { name: 'About Us', href: '/about' },
    { name: 'Shop', href: '/shop' },
    { name: 'Contact', href: '/contact' },
  ],
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showNavbar, setShowNavbar] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)

  const { openCart } = useCart()
  const { openWishlist } = useWishlist()
  const { openAuthModal } = useAuthModal()
  const { user, isAuthenticated, logout } = useAuth()

  const handleOpenAuthModal = (view: 'request-otp' | 'verify-otp' = 'request-otp') => {
    openAuthModal({ view })
    setProfileOpen(false)
    setOpen(false)
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
    setProfileOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      setIsScrolled(currentScrollY > 0)
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false)
      } else {
        setShowNavbar(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  return (
    <div className="bg-white">
      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>
      
      {/* MOBILE MENU */}
      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 z-50 flex">
          <DialogPanel className="w-full max-w-xs bg-white shadow-xl overflow-y-auto">
            <div className="flex justify-end p-4">
              <button onClick={() => setOpen(false)}>
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* 2. Removed Mobile TabGroup (Category Dropdowns) */}

            {/* Mobile Page Links */}
            <div className="border-b border-gray-200 p-4 space-y-4">
              {navigation.pages.map((page) => (
                <a
                  key={page.name}
                  href={page.href}
                  className="block text-gray-900 font-medium"
                >
                  {page.name}
                </a>
              ))}
            </div>

            {/* Mobile Auth */}
            <div className="p-4 space-y-4">
              {isAuthenticated ? (
                <>
                  <p className="text-gray-600">
                    Hi, {user?.fullName || 'Member'}
                  </p>
                  <a
                    href="/myaccount"
                    className="block text-gray-900 font-medium"
                    onClick={() => setOpen(false)}
                  >
                    My Account
                  </a>
                  <a
                    href="/orders"
                    className="block text-gray-900 font-medium"
                    onClick={() => setOpen(false)}
                  >
                    Orders
                  </a>
                  <button
                    onClick={handleLogout}
                    className="text-gray-900 font-medium"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleOpenAuthModal('request-otp')}
                    className="block text-gray-900 font-medium"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => handleOpenAuthModal('request-otp')}
                    className="block text-gray-900 font-medium"
                  >
                    Create account
                  </button>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* DESKTOP HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'} ${isScrolled ? 'shadow-md' : ''}`}>
        <nav className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            
            {/* LEFT SIDE */}
            <div className="flex flex-1 items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setOpen(true)}
                className="p-2 text-gray-500 lg:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              {/* Desktop Nav */}
              <PopoverGroup className="hidden lg:flex lg:ml-8 space-x-8">
                {/* 3. Removed the Category Popover/Dropdown Loop here */}

                {navigation.pages.map((page) => (
                  <a
                    key={page.name}
                    href={page.href}
                    className="text-sm font-medium text-gray-700 hover:text-black"
                  >
                    {page.name}
                  </a>
                ))}
              </PopoverGroup>
            </div>

            {/* CENTER LOGO */}
            <div className="flex flex-1 justify-center">
              <a href="/" className="block">
                <img
                  src='/Navbar_logo1.svg'
                  alt="Logo"
                  className="h-14 sm:h-14 md:h-14 w-auto"
                />
              </a>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-1 justify-end items-center">
              {/* Desktop Auth */}
              <div className="hidden lg:flex items-center space-x-6 relative">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="flex items-center space-x-2 rounded-full border px-3 py-1 text-sm font-medium text-gray-700 hover:text-black"
                    >
                      <span className="truncate max-w-[140px]">
                        Hi, {user?.fullName || 'Member'}
                      </span>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 py-2 z-50">
                        <a
                          href="/myaccount"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setProfileOpen(false)}
                        >
                          My Account
                        </a>
                        <a
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Orders
                        </a>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleOpenAuthModal('request-otp')}
                      className="text-gray-700 hover:text-black"
                    >
                      Sign in / Sign up
                    </button>
                  </>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={openWishlist}
                className="ml-4 p-2 text-gray-500 hover:text-gray-700"
              >
                <HeartIcon className="h-6 w-6" />
                <span className="sr-only">Wishlist</span>
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="ml-4 p-2 text-gray-500 hover:text-gray-700"
              >
                <ShoppingBagIcon className="h-6 w-6" />
                <span className="sr-only">Cart</span>
              </button>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}




