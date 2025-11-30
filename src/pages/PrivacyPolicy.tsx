import SEO from '../seo/SEO'

const PrivacyPolicy = () => {
  return (
    <div className="bg-white">
      <SEO
        title="Privacy Policy | Aesthco"
        description="Learn how Aesthco collects, uses, and protects your information when you shop premium hoodies and streetwear."
        canonical="/privacy-policy"
      />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-4 text-gray-600">
          Your trust means everything to us. This policy explains how Aesthco collects, uses, and protects your
          personal information when you browse and shop on our site.
        </p>

        <div className="mt-10 space-y-8 text-gray-700">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">Information We Collect</h2>
            <p className="mt-3">
              We collect contact details, shipping information, and order history to fulfill your purchases. We also
              collect limited analytics data to improve site performance and understand product interest.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">How We Use Your Data</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Process, deliver, and support your orders</li>
              <li>Communicate updates, support, and product news you opt into</li>
              <li>Prevent fraud and keep your account secure</li>
              <li>Improve our catalog, fit, and onsite experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Payments & Security</h2>
            <p className="mt-3">
              Payments are processed through trusted gateways. We do not store your full card details. All traffic is
              encrypted with HTTPS.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Your Choices</h2>
            <p className="mt-3">
              You can update your details or request deletion by contacting support@aesthco.com. Marketing preferences
              can be adjusted anytime in your email footer links.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
            <p className="mt-3">
              For privacy questions, reach us at{' '}
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

export default PrivacyPolicy
