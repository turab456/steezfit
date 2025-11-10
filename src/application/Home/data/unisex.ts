import type { Product } from '../../../components/Product/types'
import { getProductsByCategory } from '../../../data/catalog'

export const unisex: Product[] = getProductsByCategory('unisex')
