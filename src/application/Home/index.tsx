import HeroShowcase from "./components/HeroSection";
import TaglineSplit from "../../components/common/Banner";
import { ProductSection } from "./ui/ProductSection";
import { data } from "./data";

import TestimonialsShowcase from "./components/Testimonials";
import ShopByCategory from "./components/ShopByCategory";

const Home = () => {
  return (
    <div>
      <HeroShowcase />
      <TaglineSplit tagline="DESIGNED FOR THE BOLD." />
      <ProductSection
        title="NEW ARRIVAL"
        items={[...data.men.slice(0, 2), ...data.unisex.slice(0, 2)]}
        cta="View New Items"
        onCtaClick={() => console.log("Navigate to new arrivals")}
      />

      <ShopByCategory />

      <ProductSection
        title="POPULAR PRODUCTS"
        items={[...data.men, ...data.unisex]}
        cta="Shop All"
        onCtaClick={() => console.log("Navigate to all products")}
      />

      <TestimonialsShowcase />
    </div>
  );
};

export default Home;
