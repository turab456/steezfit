import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import ProductDetails from './components/ProductDetails'
import ProductDetailsApi from './api/ProductDetailsApi'
import type { ProductDetail } from './types'
import { ProductSection } from '../Home/ui/ProductSection'
import ShopApi from '../Shop/api/ShopApi'
import MasterApi, { type ShopMasterCollection as MasterCollection } from '../../services/MasterData'
import type { ShopVariantCard } from '../Shop/types'
import type { Product } from '../../components/Product/types'
import ProductReviews from '../Reviews/ProductReviews'
import Loader from '../../components/common/Loader'

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80'

const mapVariantToProductCard = (variantCard: ShopVariantCard): Product => {
  const primaryImage = variantCard.imageUrl || FALLBACK_IMAGE
  const hoverImage = variantCard.hoverImageUrl || primaryImage
  const basePrice = Number(variantCard.basePrice) || 0
  const salePrice = variantCard.salePrice != null ? Number(variantCard.salePrice) : null
  const hasSale = salePrice !== null && salePrice > 0 && salePrice < basePrice
  const price = hasSale ? salePrice : basePrice
  const original = hasSale ? basePrice : price
  const colorSuffix = variantCard.color?.name ? ` (${variantCard.color.name})` : ''

  return {
    id: variantCard.productSlug || String(variantCard.productId),
    cardId: variantCard.cardId,
    name: `${variantCard.name}${colorSuffix}`,
    price,
    original,
    images: {
      primary: primaryImage,
      hover: hoverImage,
    },
    tag: '',
    isActive: variantCard.productIsActive ?? true,
    isAvailable: variantCard.isAvailable,
    productSlug: variantCard.productSlug,
    detailPath: `/product/${variantCard.productSlug || variantCard.productId}`,
    selectedColorId: variantCard.color?.id,
    selectedSizeId: variantCard.size?.id,
    categoryId: variantCard.categoryId,
  }
}

type CollectionSection = {
  collection: MasterCollection
  products: Product[]
}

const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sections, setSections] = useState<CollectionSection[]>([])
  const [recError, setRecError] = useState<string | null>(null)
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

  useEffect(() => {
    let isCancelled = false
    const fetchRecommendations = async () => {
      try {
        setRecError(null)
        let collections = await MasterApi.getCollections({
          showOnHome: true,
          limit: 2,
        })
        if (!collections || collections.length === 0) {
          collections = await MasterApi.getCollections()
        }
        const topCollections = collections.slice(0, 2)
        const sectionData = await Promise.all(
          topCollections.map(async (collection) => {
            const variantCards = await ShopApi.listVariantCards({
              collectionId: collection.id,
            })
            const activeVariants = variantCards.filter((card) => card.productIsActive ?? true)
            return {
              collection,
              products: activeVariants.map(mapVariantToProductCard),
            }
          }),
        )
        if (!isCancelled) {
          setSections(sectionData.filter((s) => s.products.length > 0))
        }
      } catch (err: any) {
        if (!isCancelled) {
          setRecError(err?.message || 'Failed to load recommendations.')
          setSections([])
        }
      }
    }

    fetchRecommendations()
    return () => {
      isCancelled = true
    }
  }, [])

  const primarySection = sections[0]
  // const secondarySection = sections[1]

  const handleShopNow = (collectionId?: number) => {
    if (collectionId) {
      navigate(`/shop?collectionId=${collectionId}`)
    } else {
      navigate('/shop')
    }
  }

  const reviewProductId =
    product?.backendId ?? (product && /^\d+$/.test(product.id) ? Number(product.id) : undefined)

  if (!loading && !product) {
    return <Navigate replace to="/shop" />
  }

  return (
    <div className="bg-white pb-16">
      {loading ? (
        <div className="mx-auto flex min-h-[320px] max-w-5xl items-center justify-center px-4">
          <Loader />
        </div>
      ) : error ? (
        <div className="mx-auto flex min-h-[320px] max-w-5xl items-center justify-center px-4 text-sm font-medium text-red-600">
          {error}
        </div>
      ) : product ? (
        <ProductDetails product={product} prefill={prefill} />
      ) : null}

      {product && reviewProductId && (
        <div className="mx-auto max-w-7xl px-4 mt-12">
          <ProductReviews productId={reviewProductId} />
        </div>
      )}

      {recError && (
        <div className="mx-auto max-w-6xl px-4 pb-6 text-sm text-red-600">
          {recError}
        </div>
      )}

      {primarySection && (
        <ProductSection
          title={primarySection.collection.name}
          items={primarySection.products}
          cta="Shop Now"
          className="mt-20"
          onCtaClick={() => handleShopNow(primarySection.collection.id)}
        />
      )}

      {/* {secondarySection && (
        <ProductSection
          title={secondarySection.collection.name}
          items={secondarySection.products}
          cta="Shop Now"
          className="pb-16"
          onCtaClick={() => handleShopNow(secondarySection.collection.id)}
        />
      )} */}
    </div>
  )
}

export default ProductDetailsPage
