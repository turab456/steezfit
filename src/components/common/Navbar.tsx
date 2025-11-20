



'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
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
import AuthModal from './AuthModal'
import { useAuth } from '../../contexts/AuthContext'


const navigation = {
  categories: [
    {
      id: 'men',
      name: 'Men',
      featured: [
        {
          name: 'New Arrivals',
          href: '#',
          imageSrc:
            'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
          imageAlt: 'Drawstring top with elastic loop closure.',
        },
        {
          name: 'Artwork Tees',
          href: '#',
          imageSrc:
            'https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg',
          imageAlt: 'Three colored shirts arranged on a table.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Tops', href: '#' },
            { name: 'Pants', href: '#' },
            { name: 'Sweaters', href: '#' },
            { name: 'T-Shirts', href: '#' },
            { name: 'Jackets', href: '#' },
            { name: 'Activewear', href: '#' },
            { name: 'Browse All', href: '#' },
          ],
        },
        {
          id: 'accessories',
          name: 'Accessories',
          items: [
            { name: 'Watches', href: '#' },
            { name: 'Wallets', href: '#' },
            { name: 'Bags', href: '#' },
            { name: 'Sunglasses', href: '#' },
            { name: 'Hats', href: '#' },
            { name: 'Belts', href: '#' },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'About Us', href: '/about' },
    { name: 'Shop', href: '/shop' },
    { name: 'Contact', href: '/contact' },
  ],
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authInitialView, setAuthInitialView] =
    useState<'login' | 'signup-email'>('login')
  const [isScrolled, setIsScrolled] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [showNavbar, setShowNavbar] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)

  const { openCart } = useCart()
  const { openWishlist } = useWishlist()
  const { user, isAuthenticated, logout } = useAuth()

  const openAuthModal = (view: 'login' | 'signup-email') => {
    setAuthInitialView(view)
    setIsAuthModalOpen(true)
    setProfileOpen(false)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
    setProfileOpen(false)
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

            {/* Mobile Tabs */}
            <TabGroup>
              <TabList className="flex px-4 border-b border-gray-200">
                {navigation.categories.map((cat) => (
                  <Tab
                    key={cat.name}
                    className="flex-1 py-3 text-base font-medium data-[selected]:text-indigo-600 data-[selected]:border-indigo-600 border-b-2 border-transparent"
                  >
                    {cat.name}
                  </Tab>
                ))}
              </TabList>

              <TabPanels>
                {navigation.categories.map((cat) => (
                  <TabPanel key={cat.name} className="p-4 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      {cat.featured.map((item) => (
                        <a key={item.name} href={item.href} className="block">
                          <img
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            className="rounded-lg object-cover"
                          />
                          <h3 className="mt-2 font-medium text-gray-900">
                            {item.name}
                          </h3>
                        </a>
                      ))}
                    </div>

                    {cat.sections.map((section) => (
                      <div key={section.name}>
                        <h4 className="font-semibold text-gray-900">
                          {section.name}
                        </h4>
                        <ul className="mt-2 space-y-2">
                          {section.items.map((item) => (
                            <li key={item.name}>
                              <a
                                href={item.href}
                                className="text-gray-600 block"
                              >
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="border-t p-4 space-y-4">
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
            <div className="border-t p-4 space-y-4">
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
                    onClick={() => openAuthModal('login')}
                    className="block text-gray-900 font-medium"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => openAuthModal('signup-email')}
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

      {/* DESKTOP + MOBILE HEADER */}
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
                {navigation.categories.map((cat) => (
                  <Popover key={cat.name} className="relative">
                    <PopoverButton className="text-sm font-medium text-gray-700 hover:text-indigo-600 focus:outline-none focus-visible:text-indigo-600">
                      {cat.name}
                    </PopoverButton>
                    <PopoverPanel
                      transition
                      className="absolute left-1/2 top-full z-30 mt-4 w-screen max-w-4xl -translate-x-1/2 overflow-hidden rounded-3xl bg-white/95 p-8 shadow-2xl ring-1 ring-black/5 duration-200 ease-out data-closed:opacity-0 data-closed:translate-y-2"
                    >
                      <div className="grid gap-8 lg:grid-cols-3">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
                          {cat.featured.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className="flex flex-col gap-3 rounded-2xl bg-gray-50/70 p-4 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg"
                            >
                              <img
                                src={item.imageSrc}
                                className="h-32 w-full rounded-xl object-cover"
                                alt={item.imageAlt}
                              />
                              <p className="text-base font-semibold text-gray-900">
                                {item.name}
                              </p>
                              <span className="text-sm text-gray-500">Shop collection</span>
                            </a>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-6 lg:col-span-1">
                          {cat.sections.map((section) => (
                            <div key={section.name} className="text-left">
                              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                {section.name}
                              </p>
                              <ul className="mt-4 space-y-2">
                                {section.items.map((item) => (
                                  <li key={item.name}>
                                    <a
                                      href={item.href}
                                      className="text-sm font-medium text-gray-700 hover:text-indigo-600"
                                    >
                                      {item.name}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </PopoverPanel>
                  </Popover>
                ))}

                {navigation.pages.map((page) => (
                  <a
                    key={page.name}
                    href={page.href}
                    className="text-sm font-medium text-gray-700 hover:text-indigo-600"
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
                    className="flex items-center space-x-2 rounded-full border px-3 py-1 text-sm font-medium text-gray-700 hover:text-indigo-600"
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
                    onClick={() => openAuthModal('login')}
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => openAuthModal('signup-email')}
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    Sign up
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

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={closeAuthModal}
          onLoginSuccess={closeAuthModal}
          initialView={authInitialView}
        />
      )}
    </div>
  )
}
