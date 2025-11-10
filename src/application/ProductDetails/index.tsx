import { Navigate, useParams } from 'react-router-dom'
import ProductDetails from './components/ProductDetails'
import { getProductById, getRelatedProducts } from '../../data/catalog'
import { ProductSection } from '../Home/ui/ProductSection'

const ProductDetailsPage = () => {
  const { productId } = useParams<{ productId: string }>()
  const product = productId ? getProductById(productId) : undefined

  if (!product) {
    return <Navigate replace to="/shop" />
  }

  const related = getRelatedProducts(product.id, 4)

  return (
    <div className="bg-white pb-16">
      <ProductDetails product={product}  />

      {related.length > 0 && (
        <ProductSection
          title="You May Also Like"
          items={related}
          cta="Shop All"
          className="mt-20 pb-16"
          onCtaClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />
      )}
    </div>
  )
}

export default ProductDetailsPage
