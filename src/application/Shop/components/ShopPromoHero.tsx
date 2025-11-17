'use client'

import { useEffect, useMemo, useState } from 'react'

type HeroSlide = {
  tag: string
  title: string
  description: string
  image: string
}

const AUTO_PLAY_INTERVAL = 4000

const ShopPromoHero = () => {
  const slides: HeroSlide[] = useMemo(
    () => [
      {
        tag: 'New Arrival',
        title: 'The Blockhaus Winter Edit',
        description:
          "Layer up with thermal-lined hoodies, structured parkas, and modular knits engineered for sub-zero commutes. Quantities drop weekly—don't miss the first run.",
        image:
          'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
      },
      {
        tag: 'Offer Drop',
        title: 'Signature Essentials • 25% Off',
        description:
          'Signature fleece sets, brushed cotton crews, and all-day joggers bundled for the first time. Members unlock two-day delivery on every set.',
        image:
          'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80',
      },
      {
        tag: 'Studio Drop',
        title: 'Modular Outerwear Lab',
        description:
          'Convertible shells, detachable liners, and nano-sealed seams tested in the Swiss Alps. Designed to layer with every Blockhaus mid-layer.',
        image:
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80',
      },
    ],
    [],
  )

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, AUTO_PLAY_INTERVAL)
    return () => window.clearInterval(id)
  }, [slides.length])

  const activeSlide = slides[activeIndex]

  return (
    <section className="mx-auto mt-8 max-w-full px-4 sm:px-6 lg:px-6">
      <div className="relative flex min-h-[420px] flex-col justify-center overflow-hidden rounded-3xl bg-gray-900 px-8 py-12 sm:min-h-[460px] sm:px-12 sm:py-16 lg:min-h-[520px]">
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={slide.title}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === activeIndex ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden={index !== activeIndex}
            >
              <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/85 to-transparent" />
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-2xl text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            {activeSlide.tag}
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            {activeSlide.title}
          </h2>
          <p className="mt-4 text-base text-white/80 sm:text-lg">{activeSlide.description}</p>
        </div>
      </div>
    </section>
  )
}

export default ShopPromoHero
