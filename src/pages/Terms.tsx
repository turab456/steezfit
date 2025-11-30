import SEO from '../seo/SEO'

const Terms = () => {
  return (
    <div className="bg-white">
      <SEO
        title="Terms & Conditions | Aesthco"
        description="Review the terms for shopping at Aesthco, including orders, returns, and usage of our site."
        canonical="/terms"
      />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Terms & Conditions</h1>
        <p className="mt-4 text-gray-600">
          Welcome to Aesthco. By accessing our store, you agree to the terms below. Please read them carefully before
          placing an order.
        </p>

        <div className="mt-10 space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Orders & Fulfillment</h2>
            <p className="mt-3">
              Orders are confirmed once payment is received. Shipping timelines shared at checkout are estimates and may
              vary during peak periods.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Returns & Exchanges</h2>
            <p className="mt-3">
              Items must be unworn with tags for returns. Contact support@aesthco.com within 10 days of delivery to
              initiate an exchange or return.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Use of Website</h2>
            <p className="mt-3">
              Do not misuse the site, attempt unauthorized access, or interfere with other shoppers. Content, imagery,
              and trademarks are owned by Aesthco.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Pricing & Promotions</h2>
            <p className="mt-3">
              Prices are subject to change. Promotional offers apply as stated and cannot be combined unless noted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p className="mt-3">
              Questions about these terms? Email{' '}
              <a className="font-semibold text-gray-900 underline" href="mailto:support@aesthco.com">
                support@aesthco.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Terms
