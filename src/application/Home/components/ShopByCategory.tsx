const categories = [
  {
    id: 'outerwear',
    title: 'Urban Outerwear',
    tagline: 'Weather-ready layers',
    description: 'Technical shells and insulated pieces built for long commutes.',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    shopnow: true,
    route: '/coming-soon'
  },
  {
    id: 'training',
    title: 'Training Essentials',
    tagline: 'Move-first fabrics',
    description: 'Performance tees, leggings, and sets that breathe through every session.',
    image:
      'https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&w=1200&q=80',
    shopnow: true,
    route: '/coming-soon'
  },
  {
    id: 'womens',
    title: "Women's Studio",
    tagline: 'Sculpted silhouettes',
    description: 'Sleek layers designed to flow from reformer class to weekend reset.',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    shopnow: false,
    route: '/coming-soon'
  },
  {
    id: 'accessories',
    title: 'Accessories',
    tagline: 'Finish the look',
    description: 'Minimal caps, bags, and elevated extras to round out every fit.',
    image:
      'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1200&q=80',
    shopnow: true,
    route: '/coming-soon'
  },
]



interface ShopByCategoryProps {
  showShopNow?: boolean
}

export function ShopByCategory({ }: ShopByCategoryProps) {
  return (
    <section className=" mx-2 my-8   px-2 py-8 text-black   md:mx-8 lg:mx-6 xl:mx-8">
      <div className="overflow-hidden rounded-[20px] bg-gradient-to-br from-zinc-950 via-zinc-900 to-black text-white ">
        <div className="grid gap-6 lg:grid-cols-[0.85fr,1.15fr] lg:items-stretch">
          <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
            <div className="space-y-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-medium uppercase tracking-[0.3em] text-white/70">
                Shop by category
              </span>
              <div className="space-y-4">
                <h2 className="text-2xl font-black leading-tight tracking-tight md:text-3xl lg:text-4xl">
                  Build your weekly rotation
                </h2>
                <p className="max-w-xl text-sm text-white/70 md:text-base">
                  Discover the pieces our stylists reach for right now, from weather-proof
                  commuters to studio staples. Mix, match, and layer confidently.
                </p>
              </div>
            </div>

           
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#collections"
                className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                Browse collections
              </a>
              <a
                href="#new-arrivals"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:-translate-y-0.5 hover:border-white/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
              >
                See new arrivals
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden ">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black" />
            <div className="relative grid h-full gap-3 p-4 sm:grid-cols-2 sm:p-6 md:gap-4 md:p-6">
              {categories.map((category) => (
                <a
                  key={category.id}
                  href={category.route}
                  className="group relative h-72 sm:h-80 md:h-96 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 transition group-hover:opacity-95" />
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                    <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                      {category.tagline}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-white">{category.title}</h3>
                    <p className="mt-1 text-xs text-white/70">{category.description}</p>
                    {category.shopnow && (
                      <span className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-white/80 transition group-hover:text-white">
                        Shop now
                        <span className="translate-x-0 text-white/60 transition group-hover:translate-x-0.5 group-hover:text-white">
                          -&gt;
                        </span>
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
export default ShopByCategory