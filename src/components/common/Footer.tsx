import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter } from 'lucide-react'


type FooterProps = {
  bgWord?: string
}

const currentYear = new Date().getFullYear()

export default function FooterStride({ bgWord = 'AESTH CO' }: FooterProps) {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(90,90,90,0.35)_0%,rgba(0,0,0,0.92)_55%,rgba(0,0,0,1)_100%)]" /> */}
      {/* <div className="absolute -top-24 right-1/4 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" /> */}
      <div className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-sky-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-8xl px-6 py-14 sm:px-10 md:py-16 lg:px-12">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <div className="flex flex-col items-center gap-8 text-center md:col-span-5 md:items-start md:text-left lg:col-span-4">
            <div className="space-y-4">
              {/* <div className="inline-flex items-center gap-3 text-3xl font-black tracking-tight md:text-4xl">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
                  BH
                </span>
                Blockhaus
              </div> */}
              <div className='inline-flex items-center'>
                <img src='/footer_logo.svg' alt="Footer Logo" className='h-25' />
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-white/70 md:text-base">
                Raised in the cold streets, engineered for comfort.
                Premium everyday wear, stitched with obsessive detail.
              </p>
            </div>

            {/* <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left shadow-lg shadow-black/25 backdrop-blur md:flex-row md:gap-5 md:p-5">
              <span className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-white">
                <MapPin className="h-5 w-5" />
              </span>
              <p className="text-sm font-medium leading-relaxed text-white/85 md:text-base">
                Blockhaus Studio HQ
                <br />
                128 King&apos;s Yard, Shoreditch · London
                <br />
                Worldwide support · hello@blockhaus.com
              </p>
            </div> */}
          </div>

          <div className="grid grid-cols-1 gap-10 text-center sm:grid-cols-2 sm:text-left md:col-span-7 md:grid-cols-3 lg:col-span-8">
            <nav className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Shop
              </h4>
              <a className="block text-sm text-white/70 transition hover:text-white" href="#">
                Men
              </a>
              <a className="block text-sm text-white/70 transition hover:text-white" href="#">
                Women
              </a>
              <a className="block text-sm text-white/70 transition hover:text-white" href="#">
                Accessories
              </a>
              <a className="block text-sm text-white/70 transition hover:text-white" href="#">
                Capsule Drops
              </a>
            </nav>

            <nav className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Support
              </h4>
              <a className="block text-sm text-white/70 transition hover:text-white" href="#">
                Contact Us
              </a>
              <a className="block text-sm text-white/70 transition hover:text-white" href="#">
                FAQs
              </a>
              <a className="block text-sm text-white/70 transition hover:text-white" href="#">
                Shipping &amp; Returns
              </a>
              <a className="block text-sm text-white/70 transition hover:text-white" href="#">
                Fit Guide
              </a>
            </nav>

            <nav className="space-y-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
                Journal
              </h4>
              <a className="block text-sm text-white/70 transition hover:text-white" href="#">
                Articles
              </a>
              <a className="block text-sm text-white/70 transition hover:text-white" href="#">
                Lookbooks
              </a>
              <a className="block text-sm text-white/70 transition hover:text-white" href="#">
                Fabric Lab
              </a>
              <a className="block text-sm text-white/70 transition hover:text-white" href="#">
                Community Events
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-white/60">
            © {currentYear} Aesth Co · Tailored for the relentless · Crafted in India
          </p>
          <div className="flex items-center gap-3">
            <a
              aria-label="Instagram"
              href="https://www.instagram.com/aesthco_clothings/"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              aria-label="Mail"
              href="https://mail.google.com/mail/?view=cm&fs=1&to=support@aesthco.com&su=Support%20Request&body=Hello%20team"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
            >
              <Mail className="h-4 w-4" />
            </a>
            <a
              aria-label="Phone"
              href="tel:+918088195627"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-white transition hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/10"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative mt-12 overflow-hidden py-6 sm:py-10">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
            <div className="whitespace-nowrap text-[18vw] font-black uppercase leading-[0.85] tracking-tight text-white/5 md:text-[14vw] lg:text-[12vw]">
              {bgWord}
            </div>
          </div>
          <div className="h-[16vw] md:h-[12vw] lg:h-[10vw]" />
        </div>
      </div>
    </footer>
  )
}
