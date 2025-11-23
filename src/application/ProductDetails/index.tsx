import { useEffect, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import ProductDetails from './components/ProductDetails'
import ProductDetailsApi from './api/ProductDetailsApi'
import type { ProductDetail } from './types'
import { ProductSection } from '../Home/ui/ProductSection'

const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>()
  const [searchParams] = useSearchParams()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const prefillColorId = searchParams.get('colorId')
  const prefillSizeId = searchParams.get('sizeId')
  const prefill = {
    colorId: prefillColorId ? Number(prefillColorId) : undefined,
    sizeId: prefillSizeId ? Number(prefillSizeId) : undefined,
  }

  useEffect(() => {
    if (!productId) {
      setProduct(null)
      setLoading(false)
      return
    }

    let isCancelled = false
    const fetchProduct = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await ProductDetailsApi.getByIdOrSlug(productId)
        if (!isCancelled) {
          setProduct(data)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load product.')
          setProduct(null)
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    fetchProduct()
    return () => {
      isCancelled = true
    }
  }, [productId])

  if (!loading && !product) {
    return <Navigate replace to="/shop" />
  }

  return (
    <div className="bg-white pb-16">
      {loading ? (
        <div className="mx-auto flex min-h-[320px] max-w-5xl items-center justify-center px-4 text-sm font-medium text-gray-500">
          Loading product...
        </div>
      ) : error ? (
        <div className="mx-auto flex min-h-[320px] max-w-5xl items-center justify-center px-4 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : product ? (
        <ProductDetails product={product} prefill={prefill} />
      ) : null}

      <ProductSection
        title="You May Also Like"
        items={[]}
        cta="Shop All"
        className="mt-20 pb-16"
        onCtaClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  )
}

export default ProductDetailsPage
