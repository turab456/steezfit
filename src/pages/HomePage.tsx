import Home from '../application/Home'
import SEO from '../seo/SEO'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'Aesthco',
  url: 'https://aesthco.com',
  logo: 'https://aesthco.com/navbar.png',
  sameAs: ['https://aesthco.com'],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Aesthco',
  url: 'https://aesthco.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://aesthco.com/shop?search={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

const HomePage = () => {
  return (
    <>
      <SEO
        title="Aesthco – Premium Hoodies & Streetwear"
        description="Shop the latest collection of oversized hoodies, zip-ups, and aesthetic streetwear at Aesthco."
        canonical="/"
      >
        <script type="application/ld+json">
          {JSON.stringify([organizationSchema, websiteSchema])}
        </script>
      </SEO>
      <Home />
    </>
  )
}

export default HomePage
