import { Helmet } from 'react-helmet'
import type { ReactNode } from 'react'

type SEOProps = {
  title: string
  description?: string
  canonical?: string
  image?: string
  type?: 'website' | 'product'
  robots?: string
  children?: ReactNode
}

const SITE_URL = 'https://aesthco.com'
const DEFAULT_IMAGE = `${SITE_URL}/black_logo.png`

export const buildCanonicalUrl = (canonical?: string) => {
  if (!canonical) return SITE_URL
  if (canonical.startsWith('http')) return canonical
  return `${SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`
}

const SEO = ({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  robots = 'index,follow',
  children,
}: SEOProps) => {
  const canonicalUrl = buildCanonicalUrl(canonical)
  const metaDescription =
    description ||
    'Shop premium hoodies, zip-ups, and aesthetic streetwear from Aesthco with fast shipping and easy returns.'
  const shareImage = image.startsWith('http') ? image : `${SITE_URL}${image}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={shareImage} />
      <meta property="og:site_name" content="Aesthco" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={shareImage} />

      {children}
    </Helmet>
  )
}

export default SEO
