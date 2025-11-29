import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroShowcase from "./components/HeroSection";
import TaglineSplit from "../../components/common/Banner";
import RecentOrders from "./components/RecentOrders";
import { ProductSection } from "./ui/ProductSection";
import TestimonialsShowcase from "./components/Testimonials";
import ShopByCategory from "./components/ShopByCategory";
import ShopApi from "../Shop/api/ShopApi";
import MasterApi, { type ShopMasterCollection as MasterCollection } from "../../services/MasterData";
import type { ShopVariantCard } from "../Shop/types";
import type { Product } from "../../components/Product/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80";

const mapVariantToProductCard = (variantCard: ShopVariantCard): Product => {
  const primaryImage = variantCard.imageUrl || FALLBACK_IMAGE;
  const hoverImage = variantCard.hoverImageUrl || primaryImage;
  const basePrice = Number(variantCard.basePrice) || 0;
  const salePrice =
    variantCard.salePrice != null ? Number(variantCard.salePrice) : null;
  const hasSale = salePrice !== null && salePrice > 0 && salePrice < basePrice;
  const price = hasSale ? salePrice : basePrice;
  const original = hasSale ? basePrice : price;
  const colorSuffix = variantCard.color?.name
    ? ` (${variantCard.color.name})`
    : "";

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
    tag: "",
    isActive: variantCard.productIsActive ?? true,
    isAvailable: variantCard.isAvailable,
    productSlug: variantCard.productSlug,
    detailPath: `/product/${variantCard.productSlug || variantCard.productId}`,
    selectedColorId: variantCard.color?.id,
    selectedSizeId: variantCard.size?.id,
    categoryId: variantCard.categoryId,
  };
};

type CollectionSection = {
  collection: MasterCollection;
  products: Product[];
};

const Home = () => {
  const [sections, setSections] = useState<CollectionSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isCancelled = false;
    const fetchCollectionsWithProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let collections = await MasterApi.getCollections({
          showOnHome: true,
          limit: 2,
        });
        if (!collections || collections.length === 0) {
          collections = await MasterApi.getCollections();
        }
        const topCollections = (collections && collections.length > 0)
          ? collections.slice(0, 2)
          : [];

        const sectionData = await Promise.all(
          topCollections.map(async (collection) => {
            const variantCards = await ShopApi.listVariantCards({
              collectionId: collection.id,
            });
            const activeVariants = variantCards.filter(
              (card) => card.productIsActive ?? true
            );
            return {
              collection,
              products: activeVariants.map(mapVariantToProductCard),
            };
          })
        );

        if (!isCancelled) {
          setSections(sectionData.filter((s) => s.products.length > 0));
        }
      } catch (err: any) {
        if (!isCancelled) {
          setError(
            err?.message || "Failed to load collections for the homepage."
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchCollectionsWithProducts();
    return () => {
      isCancelled = true;
    };
  }, []);

  const primarySection = sections[0];
  const secondarySection = sections[1];

  const handleShopNow = (collectionId?: number) => {
    if (collectionId) {
      navigate(`/shop?collectionId=${collectionId}`);
    } else {
      navigate("/shop");
    }
  };

  return (
    <div>
      <HeroShowcase />
      <TaglineSplit tagline="DESIGNED FOR THE BOLD." />

      <RecentOrders />

      {loading && (
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500">
          Loading collections...
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-red-600">
          {error}
        </div>
      )}

      {primarySection && (
        <ProductSection
          key={primarySection.collection.id}
          title={primarySection.collection.name}
          items={primarySection.products}
          cta="Shop Now"
          onCtaClick={() => handleShopNow(primarySection.collection.id)}
        />
      )}

      <ShopByCategory />

      {secondarySection && (
        <ProductSection
          key={secondarySection.collection.id}
          title={secondarySection.collection.name}
          items={secondarySection.products}
          cta="Shop Now"
          onCtaClick={() => handleShopNow(secondarySection.collection.id)}
        />
      )}

      <TestimonialsShowcase />
    </div>
  );
};

export default Home;
