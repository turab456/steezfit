import type { Product } from '../components/Product/types'

export type ProductCategory = 'men' | 'women' | 'unisex' | 'accessories'

export type ProductColorOption = {
  id: string
  name: string
  value: string
}

export type ProductSizeOption = {
  id: string
  name: string
  inStock: boolean
}

export type ProductDetail = Product & {
  sku: string
  shortDescription: string
  description: string
  highlights: string[]
  gallery: Array<{
    id: string
    src: string
    alt: string
  }>
  colors: ProductColorOption[]
  sizes: ProductSizeOption[]
  category: ProductCategory
}

function buildSizes(labels: string[], soldOut: string[] = []): ProductSizeOption[] {
  const soldOutSet = new Set(soldOut.map((label) => label.toLowerCase()))
  return labels.map((label) => {
    const normalized = label.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    return {
      id: normalized,
      name: label,
      inStock: !soldOutSet.has(label.toLowerCase()),
    }
  })
}

function buildColors(options: Array<{ id: string; name: string; value: string }>): ProductColorOption[] {
  return options.map((option) => ({ ...option }))
}

const PRODUCT_CATALOG: Record<string, ProductDetail> = {
  'everyday-hoodie-carbon': {
    id: 'everyday-hoodie-carbon',
    name: 'Everyday Hoodie - Carbon',
    price: 98,
    original: 128,
    images: {
      primary: 'https://images.unsplash.com/photo-1520962619285-2179b6a91c15?auto=format&fit=crop&w=1200&q=80',
      hover: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    },
    tag: 'NEW',
    sku: 'EH-001',
    shortDescription: 'Relaxed fleece hoodie with a brushed interior that keeps warmth in without the bulk.',
    description:
      'Cut from a premium cotton blend, the Everyday Hoodie combines an easy drape with durable finishing touches. The double-layer hood, reinforced kangaroo pocket, and tonal rib trims are made to handle daily wear while staying soft against the skin.',
    highlights: [
      'Brushed cotton blend for week-round comfort',
      'Three-panel hood with self-fabric drawcord',
      'Ribbed cuffs and hem hold their shape wash after wash',
    ],
    gallery: [
      {
        id: 'hero-1',
        src: 'https://images.unsplash.com/photo-1520962619285-2179b6a91c15?auto=format&fit=crop&w=1600&q=80',
        alt: 'Model wearing the carbon hoodie looking over the shoulder.',
      },
      {
        id: 'hero-2',
        src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
        alt: 'Side profile of the carbon hoodie highlighting the hood construction.',
      },
      {
        id: 'hero-3',
        src: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80',
        alt: 'Close up of the hoodie pocket and ribbed cuff.',
      },
      {
        id: 'hero-4',
        src: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80',
        alt: 'Stack of folded carbon hoodies showcasing texture.',
      },
    ],
    colors: buildColors([
      { id: 'carbon', name: 'Carbon', value: '#111827' },
      { id: 'sky', name: 'Sky', value: '#bae6fd' },
      { id: 'sage', name: 'Sage', value: '#bbf7d0' },
    ]),
    sizes: buildSizes(['S', 'M', 'L', 'XL']),
    category: 'men',
  },
  'field-crewneck-ivory': {
    id: 'field-crewneck-ivory',
    name: 'Field Crewneck - Ivory',
    price: 76,
    original: 105,
    images: {
      primary: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
      hover: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80',
    },
    sku: 'FC-204',
    shortDescription: 'Lightweight French terry crewneck with clean tailoring for work or weekend.',
    description:
      'The Field Crewneck is built from enzyme-washed French terry that feels broken-in from the first wear. A refined collar finish and forward shoulder seams keep the profile sharp while maintaining lounge-level comfort.',
    highlights: [
      '320 GSM French terry with soft hand feel',
      'Forward shoulder seams reduce pack rub',
      'Flatlock stitching to prevent interior chafe',
    ],
    gallery: [
      {
        id: 'gallery-1',
        src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
        alt: 'Model wearing ivory crewneck sitting on a stool.',
      },
      {
        id: 'gallery-2',
        src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80',
        alt: 'Back view of the ivory crewneck with shoulder detail.',
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=1600&q=80',
        alt: 'Folded crewnecks stacked on a table.',
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1600&q=80',
        alt: 'Close detail of the crewneck fabric texture.',
      },
    ],
    colors: buildColors([
      { id: 'ivory', name: 'Ivory', value: '#f8fafc' },
      { id: 'stone', name: 'Stone', value: '#e5e7eb' },
      { id: 'charcoal', name: 'Charcoal', value: '#4b5563' },
    ]),
    sizes: buildSizes(['XS', 'S', 'M', 'L', 'XL']),
    category: 'men',
  },
  'canvas-utility-jacket': {
    id: 'canvas-utility-jacket',
    name: 'Canvas Utility Jacket',
    price: 148,
    original: 198,
    images: {
      primary: 'https://images.unsplash.com/photo-1551571557-4b83ae228a63?auto=format&fit=crop&w=1200&q=80',
      hover: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
    },
    tag: 'HOT',
    sku: 'CU-311',
    shortDescription: 'Durable cotton canvas jacket with utilitarian storage and weather-resistant wax finish.',
    description:
      'Inspired by classic field jackets, this updated layer pairs a waxed canvas shell with breathable cotton lining. Four exterior bellows pockets secure essentials, while hidden interior compartments keep your tech protected.',
    highlights: [
      'Water-resistant waxed cotton canvas shell',
      'Adjustable waist tabs customize the fit',
      'Four snap-flap pockets plus two hidden interior pockets',
    ],
    gallery: [
      {
        id: 'gallery-1',
        src: 'https://images.unsplash.com/photo-1551571557-4b83ae228a63?auto=format&fit=crop&w=1600&q=80',
        alt: 'Utility jacket draped over shoulder against brick wall.',
      },
      {
        id: 'gallery-2',
        src: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=80',
        alt: 'Close shot of jacket pockets and buttons.',
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80',
        alt: 'Person adjusting collar of the utility jacket.',
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1472417583565-62e7bdeda490?auto=format&fit=crop&w=1600&q=80',
        alt: 'Jacket laid flat showing interior details.',
      },
    ],
    colors: buildColors([
      { id: 'copper', name: 'Copper', value: '#b45309' },
      { id: 'olive', name: 'Olive', value: '#4d7c0f' },
      { id: 'midnight', name: 'Midnight', value: '#1f2937' },
    ]),
    sizes: buildSizes(['S', 'M', 'L', 'XL']),
    category: 'men',
  },
  'weekend-chino-sand': {
    id: 'weekend-chino-sand',
    name: 'Weekend Chino - Sand',
    price: 88,
    original: 88,
    images: {
      primary: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
      hover: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    },
    sku: 'WC-117',
    shortDescription: 'Slim tapered chino with a hint of stretch for nonstop movement and comfort.',
    description:
      'Tailored for an easy weekend vibe, this chino features a mid-rise, tapered leg, and smooth sateen finish. The blended cotton fabric resists wrinkles and keeps its shape even after long travel days.',
    highlights: [
      '2% elastane stretch woven for mobility',
      'Wrinkle-resistant sateen finish',
      'YKK zipper fly with clean bar-tack finish',
    ],
    gallery: [
      {
        id: 'gallery-1',
        src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1600&q=80',
        alt: 'Model wearing sand chinos leaning on a wall.',
      },
      {
        id: 'gallery-2',
        src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
        alt: 'Close up of chino pocket and stitching.',
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1523380235250-5260ff1713ee?auto=format&fit=crop&w=1600&q=80',
        alt: 'Stack of chinos arranged by color.',
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=1600&q=80',
        alt: 'Person walking wearing chinos and sneakers.',
      },
    ],
    colors: buildColors([
      { id: 'sand', name: 'Sand', value: '#f5f5dc' },
      { id: 'charcoal', name: 'Charcoal', value: '#4b5563' },
      { id: 'navy', name: 'Navy', value: '#1e3a8a' },
    ]),
    sizes: buildSizes(['28', '30', '32', '34', '36']),
    category: 'men',
  },
  'trail-runner-phantom': {
    id: 'trail-runner-phantom',
    name: 'Trail Runner - Phantom',
    price: 132,
    original: 165,
    images: {
      primary: 'https://images.unsplash.com/photo-1556906781-9a41296134ec?auto=format&fit=crop&w=1200&q=80',
      hover: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
    },
    sku: 'TR-502',
    shortDescription: 'All-terrain running shoe with Vibram outsole and responsive midsole cushioning.',
    description:
      'Engineered for mixed terrain, the Trail Runner pairs a ripstop upper with welded reinforcements and a Vibram Megagrip outsole. A dual-density midsole softens impact while a rock plate shields against sharp debris.',
    highlights: [
      'Vibram Megagrip outsole for superior traction',
      'Ripstop upper with welded overlays for durability',
      'Gusseted tongue keeps out trail debris',
    ],
    gallery: [
      {
        id: 'gallery-1',
        src: 'https://images.unsplash.com/photo-1556906781-9a41296134ec?auto=format&fit=crop&w=1600&q=80',
        alt: 'Trail running shoes on a rock with mountain background.',
      },
      {
        id: 'gallery-2',
        src: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1600&q=80',
        alt: 'Runner lacing up trail shoes.',
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1612810806695-30ba5f1603b0?auto=format&fit=crop&w=1600&q=80',
        alt: 'Close up of trail shoe outsole pattern.',
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1600&q=80',
        alt: 'Trail shoes in action on a muddy path.',
      },
    ],
    colors: buildColors([
      { id: 'phantom', name: 'Phantom', value: '#0f172a' },
      { id: 'ember', name: 'Ember', value: '#fb7185' },
      { id: 'glacier', name: 'Glacier', value: '#7dd3fc' },
    ]),
    sizes: buildSizes(['7', '8', '9', '10', '11', '12']),
    category: 'unisex',
  },
  'daylight-tote': {
    id: 'daylight-tote',
    name: 'Daylight Canvas Tote',
    price: 58,
    original: 72,
    images: {
      primary: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
      hover: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
    },
    sku: 'DT-045',
    shortDescription: 'Heavyweight canvas tote with reinforced base and internal laptop sleeve.',
    description:
      'Made with recycled cotton canvas, the Daylight Tote is built for daily commutes and market runs alike. Reinforced handles and a structured base keep contents upright, while an interior zip pocket secures smaller items.',
    highlights: [
      '16 oz recycled cotton canvas',
      'Fits up to a 15 inch laptop in padded sleeve',
      'Water-resistant finish for rainy commutes',
    ],
    gallery: [
      {
        id: 'gallery-1',
        src: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1600&q=80',
        alt: 'Canvas tote bag hanging on a chair.',
      },
      {
        id: 'gallery-2',
        src: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1600&q=80',
        alt: 'Person carrying the tote bag with flowers peeking out.',
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1532798442725-b7a1cfac6226?auto=format&fit=crop&w=1600&q=80',
        alt: 'Close up of tote bag handle stitching.',
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80',
        alt: 'Tote bag placed on a wooden table with accessories.',
      },
    ],
    colors: buildColors([
      { id: 'natural', name: 'Natural', value: '#f5f5f4' },
      { id: 'midnight', name: 'Midnight', value: '#0f172a' },
      { id: 'spruce', name: 'Spruce', value: '#065f46' },
    ]),
    sizes: buildSizes(['One Size']),
    category: 'accessories',
  },
  'city-parka-navy': {
    id: 'city-parka-navy',
    name: 'City Parka - Navy',
    price: 210,
    original: 260,
    images: {
      primary: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
      hover: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1200&q=80',
    },
    tag: 'NEW',
    sku: 'CP-880',
    shortDescription: 'Weather-ready city parka with seam-sealed construction and recycled insulation.',
    description:
      'Built for cold commutes, the City Parka pairs a waterproof breathable shell with 200g of recycled insulation. A full-coverage hood, storm cuffs, and fleece-lined pockets keep warmth in when the forecast drops.',
    highlights: [
      'Fully seam-sealed two-layer shell',
      'Removable faux fur hood trim',
      'Interior media pocket with headphone port',
    ],
    gallery: [
      {
        id: 'gallery-1',
        src: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
        alt: 'Model in navy parka walking through city streets.',
      },
      {
        id: 'gallery-2',
        src: 'https://images.unsplash.com/photo-1475180098004-ca77a66827be?auto=format&fit=crop&w=1600&q=80',
        alt: 'Parka hood and collar detail shot.',
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1600&q=80',
        alt: 'Close up of parka zipper and snap closures.',
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
        alt: 'Interior pocket detail of the parka.',
      },
    ],
    colors: buildColors([
      { id: 'navy', name: 'Navy', value: '#1e3a8a' },
      { id: 'graphite', name: 'Graphite', value: '#374151' },
      { id: 'rust', name: 'Rust', value: '#b45309' },
    ]),
    sizes: buildSizes(['XS', 'S', 'M', 'L', 'XL']),
    category: 'men',
  },
  'lounge-set-heather': {
    id: 'lounge-set-heather',
    name: 'Lounge Set - Heather',
    price: 96,
    original: 124,
    images: {
      primary: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1200&q=80',
      hover: 'https://images.unsplash.com/photo-1522562089844-309c61c05661?auto=format&fit=crop&w=1200&q=80',
    },
    sku: 'LS-132',
    shortDescription: 'Coordinated lounge set in breathable modal blend with relaxed tapered jogger.',
    description:
      'Soft enough for lazy mornings yet polished enough for video calls, this lounge set pairs a drop-shoulder crew with tapered joggers. The modal-rich fabric stays cool to the touch and resists pilling after repeated washes.',
    highlights: [
      'Modal, cotton, and elastane blend for drape',
      'Elastic waistband with hidden drawcord',
      'Top and bottom feature roomy side pockets',
    ],
    gallery: [
      {
        id: 'gallery-1',
        src: 'https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=1600&q=80',
        alt: 'Person relaxing on couch wearing lounge set.',
      },
      {
        id: 'gallery-2',
        src: 'https://images.unsplash.com/photo-1522562089844-309c61c05661?auto=format&fit=crop&w=1600&q=80',
        alt: 'Folded lounge set on bed.',
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
        alt: 'Close up of lounge set fabric.',
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
        alt: 'Jogger waistband detail of lounge set.',
      },
    ],
    colors: buildColors([
      { id: 'heather', name: 'Heather', value: '#cbd5f5' },
      { id: 'charcoal', name: 'Charcoal', value: '#4b5563' },
      { id: 'rose', name: 'Rose', value: '#fb7185' },
    ]),
    sizes: buildSizes(['XS', 'S', 'M', 'L']),
    category: 'unisex',
  },
  'men-hoodie-zip-blue': {
    id: 'men-hoodie-zip-blue',
    name: 'Block Zipper Hoodie',
    price: 89,
    original: 149,
    images: {
      primary: 'https://framerusercontent.com/images/TqxGifAr9eDahco6NfkZqc6A.jpg',
      hover: 'https://framerusercontent.com/images/TqxGifAr9eDahco6NfkZqc6A.jpg',
    },
    tag: 'NEW',
    sku: 'BH-201',
    shortDescription: 'Panelled zip hoodie with contrast blocking and breathable mesh lining.',
    description:
      'With a modern athletic cut, this zip hoodie combines brushed fleece panels with contrast nylon blocking. Mesh ventilation at the underarm and a two-way zipper make it easy to tune airflow on the go.',
    highlights: [
      'Two-way zipper with storm guard',
      'Hidden phone pocket inside kangaroo pouch',
      'Mesh-lined hood for breathable coverage',
    ],
    gallery: [
      {
        id: 'gallery-1',
        src: 'https://framerusercontent.com/images/TqxGifAr9eDahco6NfkZqc6A.jpg',
        alt: 'Model wearing block zipper hoodie sitting casually.',
      },
      {
        id: 'gallery-2',
        src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
        alt: 'Close up of zipper and panel detail on hoodie.',
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
        alt: 'Hoodie hood detail with mesh lining.',
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
        alt: 'Folded hoodie showcasing color blocking.',
      },
    ],
    colors: buildColors([
      { id: 'slate', name: 'Slate', value: '#475569' },
      { id: 'sky', name: 'Sky', value: '#38bdf8' },
      { id: 'ember', name: 'Ember', value: '#f97316' },
    ]),
    sizes: buildSizes(['S', 'M', 'L', 'XL']),
    category: 'men',
  },
  'men-tee-oversized-block': {
    id: 'men-tee-oversized-block',
    name: 'Oversized Block T-Shirt',
    price: 129,
    original: 199,
    images: {
      primary: 'https://framerusercontent.com/images/TqxGifAr9eDahco6NfkZqc6A.jpg',
      hover: 'https://framerusercontent.com/images/LqxeS96gyIthgcW3bAX3FOGgkas.jpg',
    },
    sku: 'OB-334',
    shortDescription: 'Boxy heavyweight tee with color block chest panel and dropped shoulder fit.',
    description:
      'Cut oversized for relaxed drape, this tee uses a heavyweight jersey that resists twisting over time. The contrast chest panel is double stitched for durability and visual interest.',
    highlights: [
      '260 GSM heavyweight jersey cotton',
      'Pre-shrunk for reliable fit out of the box',
      'Reinforced shoulder seam taping',
    ],
    gallery: [
      {
        id: 'gallery-1',
        src: 'https://framerusercontent.com/images/LqxeS96gyIthgcW3bAX3FOGgkas.jpg',
        alt: 'Oversized block tee on a model with sunglasses.',
      },
      {
        id: 'gallery-2',
        src: 'https://framerusercontent.com/images/TqxGifAr9eDahco6NfkZqc6A.jpg',
        alt: 'Front view of the block tee sitting on a stool.',
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
        alt: 'Detail of tee fabric and stitching.',
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?auto=format&fit=crop&w=1600&q=80',
        alt: 'T-shirt folded showing color block panel.',
      },
    ],
    colors: buildColors([
      { id: 'graphite', name: 'Graphite', value: '#1f2937' },
      { id: 'sand', name: 'Sand', value: '#f5f5dc' },
      { id: 'coral', name: 'Coral', value: '#fb7185' },
    ]),
    sizes: buildSizes(['XS', 'S', 'M', 'L', 'XL']),
    category: 'men',
  },
  'men-long-tee': {
    id: 'men-long-tee',
    name: 'Long T-Shirt',
    price: 49,
    original: 69,
    images: {
      primary: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80',
      hover: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1600&q=80',
    },
    tag: 'HOT',
    sku: 'LT-412',
    shortDescription: 'Longline tee with curved hem and breathable cotton jersey for everyday layering.',
    description:
      'This longline silhouette is crafted from combed cotton jersey that drapes without clinging. The curved hem and side vents make it ideal for layering over denim or joggers.',
    highlights: [
      'Combed cotton jersey with enzyme wash',
      'Curved hem and side vents increase movement',
      'Shoulder-to-shoulder taping adds durability',
    ],
    gallery: [
      {
        id: 'gallery-1',
        src: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1600&q=80',
        alt: 'Model wearing long t-shirt sitting in sunlight.',
      },
      {
        id: 'gallery-2',
        src: 'https://images.unsplash.com/photo-1514861389627-59af83aaad09?auto=format&fit=crop&w=1600&q=80',
        alt: 'Back view of long t-shirt showing length.',
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
        alt: 'Close detail of t-shirt fabric texture.',
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
        alt: 'Long t-shirt folded on table.',
      },
    ],
    colors: buildColors([
      { id: 'white', name: 'White', value: '#f8fafc' },
      { id: 'olive', name: 'Olive', value: '#4d7c0f' },
      { id: 'black', name: 'Black', value: '#111827' },
    ]),
    sizes: buildSizes(['S', 'M', 'L', 'XL']),
    category: 'men',
  },
  'uni-hoodie-core-black': {
    id: 'uni-hoodie-core-black',
    name: 'Core Hoodie - Black',
    price: 99,
    original: 159,
    images: {
      primary: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      hover: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    },
    tag: 'NEW',
    sku: 'UH-901',
    shortDescription: 'Minimal pullover hoodie cut from organic cotton fleece with subtle tonal logo.',
    description:
      'The Core Hoodie blends a clean silhouette with premium organic cotton fleece. Flat-knit drawcords, tonal embroidery, and a double-stitched kangaroo pocket deliver a refined upgrade to a staple layer.',
    highlights: [
      'Organic cotton fleece with brushed interior',
      'Double-stitched kangaroo pocket for durability',
      'Tonal chest embroidery keeps branding subtle',
    ],
    gallery: [
      {
        id: 'gallery-1',
        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
        alt: 'Model wearing black core hoodie against neutral backdrop.',
      },
      {
        id: 'gallery-2',
        src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80',
        alt: 'Close up of hoodie fabric texture.',
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80',
        alt: 'Folded hoodies stacked showing different colors.',
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
        alt: 'Hoodie drawcord and neckline detail.',
      },
    ],
    colors: buildColors([
      { id: 'black', name: 'Black', value: '#0f172a' },
      { id: 'ocean', name: 'Ocean', value: '#1e40af' },
      { id: 'forest', name: 'Forest', value: '#047857' },
    ]),
    sizes: buildSizes(['XS', 'S', 'M', 'L', 'XL']),
    category: 'unisex',
  },
  'uni-hoodie-fleece': {
    id: 'uni-hoodie-fleece',
    name: 'Fleece Hoodie',
    price: 119,
    original: 179,
    images: {
      primary: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=1200&q=80',
      hover: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=1600&q=80',
    },
    sku: 'UF-744',
    shortDescription: 'Ultra-soft fleece hoodie with oversized hood and minimal seam lines for premium drape.',
    description:
      'Designed with comfort-first tailoring, this fleece hoodie uses a brushed interior and seamless side panels for a fluid silhouette. The oversized hood is lined in jersey for structure without extra weight.',
    highlights: [
      'Seamless side panels for smooth drape',
      'Oversized hood with jersey lining',
      'Hidden zip pocket inside kangaroo pouch',
    ],
    gallery: [
      {
        id: 'gallery-1',
        src: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=1600&q=80',
        alt: 'Model in soft fleece hoodie leaning against wall.',
      },
      {
        id: 'gallery-2',
        src: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1600&q=80',
        alt: 'Close detail of fleece texture.',
      },
      {
        id: 'gallery-3',
        src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80',
        alt: 'Hood detail with drawcord.',
      },
      {
        id: 'gallery-4',
        src: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80',
        alt: 'Folded fleece hoodies stacked.',
      },
    ],
    colors: buildColors([
      { id: 'ash', name: 'Ash', value: '#e5e7eb' },
      { id: 'indigo', name: 'Indigo', value: '#4338ca' },
      { id: 'terracotta', name: 'Terracotta', value: '#f97316' },
    ]),
    sizes: buildSizes(['XS', 'S', 'M', 'L', 'XL'], ['XS']),
    category: 'unisex',
  },
}

const toSummary = (product: ProductDetail): Product => ({
  id: product.id,
  name: product.name,
  price: product.price,
  original: product.original,
  images: product.images,
  tag: product.tag,
})

export const productCatalog: Record<string, ProductDetail> = PRODUCT_CATALOG

export const productSummaries: Product[] = Object.values(PRODUCT_CATALOG).map(toSummary)

export function getProductById(id: string): ProductDetail | undefined {
  return PRODUCT_CATALOG[id]
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return Object.values(PRODUCT_CATALOG)
    .filter((product) => product.category === category)
    .map(toSummary)
}

export function getRelatedProducts(currentId: string, limit = 4): Product[] {
  const current = PRODUCT_CATALOG[currentId]
  const collection = current ? current.category : undefined
  const filtered = Object.values(PRODUCT_CATALOG).filter((product) => {
    if (product.id === currentId) {
      return false
    }
    if (!collection) {
      return true
    }
    return product.category === collection
  })

  return filtered.slice(0, limit).map(toSummary)
}
