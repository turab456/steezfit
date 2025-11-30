'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
} from '@headlessui/react'
import {
  Bars3Icon,
  ChevronDownIcon,
  HeartIcon,
  ShoppingBagIcon,
  XMarkIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useAuthModal } from '../../contexts/AuthModalContext'
import { useAuth } from '../../contexts/AuthContext'

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
  const profileRef = useRef<HTMLDivElement>(null)

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
    setOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      setIsScrolled(currentScrollY > 0)
      
      // Hide navbar on scroll down, show on scroll up (after 100px)
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }

    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [profileOpen])

  return (
    <div className="bg-white">
      {/* Spacer to prevent layout jump since header is fixed */}
      <div className="h-16"></div>
      
      {/* MOBILE MENU FULL SCREEN OVERLAY */}
      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
        <div className="fixed inset-0 bg-black/25" />

        <div className="fixed inset-0 z-50 flex">
          <DialogPanel className="relative flex w-full flex-col bg-white shadow-xl">
            {/* Mobile Header (Logo + Close) */}
            <div className="flex items-center px-4 py-4 border-b border-gray-100 relative">
              <div className="flex-1 flex justify-center">
                <a href="/" className="-m-1.5 p-1.5">
                  <img
                    src='/Navbar_logo1.svg'
                    alt="Logo"
                    className="h-12 w-auto"
                  />
                </a>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700 absolute right-4"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Mobile Content - Centered */}
            <div className="flex flex-1 flex-col overflow-y-auto px-6 py-8">
              
              {/* Navigation Links */}
              <div className="flex flex-col items-center gap-8 mb-auto mt-8">
                {navigation.pages.map((page) => (
                  <a
                    key={page.name}
                    href={page.href}
                    className="text-xl font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    {page.name}
                  </a>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="mt-12 space-y-4 border-t border-gray-100 pt-8">
                {isAuthenticated ? (
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-sm font-medium text-gray-500">
                      Hi, {user?.fullName || 'Member'}
                    </p>
                    <div className="grid w-full grid-cols-2 gap-4">
                        <a
                        href="/myaccount"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-900"
                        >
                        My Account
                        </a>
                        <a
                        href="/orders"
                        onClick={() => setOpen(false)}
                        className="flex items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-900"
                        >
                        Orders
                        </a>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-center text-sm font-medium text-red-600 py-2"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={() => handleOpenAuthModal('request-otp')}
                      className="flex w-full items-center justify-center rounded-full bg-black px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition hover:bg-gray-800"
                    >
                      Sign In / Join
                    </button>
                    <p className="text-xs text-gray-400">
                        Login to access your orders and wishlist
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* DESKTOP HEADER */}
      <header className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'} ${isScrolled ? 'shadow-sm' : ''}`}>
        <nav className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            
            {/* LEFT SIDE (Mobile Menu Trigger + Desktop Nav) */}
            <div className="flex flex-1 items-center">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="p-2 -ml-2 text-gray-500 lg:hidden"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>

              {/* Desktop Nav Links */}
              <PopoverGroup className="hidden lg:flex lg:gap-x-8">
                {navigation.pages.map((page) => (
                  <a
                    key={page.name}
                    href={page.href}
                    className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
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
                  className="h-12 sm:h-14 w-auto"
                />
              </a>
            </div>

            {/* RIGHT SIDE (Icons & Profile) */}
            <div className="flex flex-1 justify-end items-center gap-2 sm:gap-4">
              {/* Desktop Auth */}
              <div className="hidden lg:flex items-center relative">
                {isAuthenticated ? (
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="flex items-center gap-2 rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:border-gray-200 hover:bg-gray-50"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span className="max-w-[100px] truncate">
                        {user?.fullName?.split(' ')[0] || 'Account'}
                      </span>
                      <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Profile Dropdown */}
                    {profileOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-xl bg-white p-1 shadow-lg ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                        <a
                          href="/myaccount"
                          className="block rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setProfileOpen(false)}
                        >
                          My Account
                        </a>
                        <a
                          href="/orders"
                          className="block rounded-lg px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Orders
                        </a>
                        <div className="my-1 h-px bg-gray-100" />
                        <button
                          onClick={handleLogout}
                          className="block w-full rounded-lg px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenAuthModal('request-otp')}
                    className="text-sm font-medium text-gray-900 hover:text-gray-600 transition-colors"
                  >
                    Sign In
                  </button>
                )}
              </div>

              {/* Icons */}
              <div className="flex items-center pl-4 ml-2 lg:ml-0 lg:border-none lg:pl-0">
                  <button
                    onClick={openWishlist}
                    className="p-2 text-gray-500 hover:text-black transition-colors"
                  >
                    <span className="sr-only">Wishlist</span>
                    <HeartIcon className="h-6 w-6" />
                  </button>

                  <button
                    onClick={openCart}
                    className="p-2 text-gray-500 hover:text-black transition-colors"
                  >
                    <span className="sr-only">Cart</span>
                    <ShoppingBagIcon className="h-6 w-6" />
                  </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}