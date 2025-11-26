import type { FC } from "react";

declare module "../Reviews/ProductReviews" {
  type Props = {
    productId: number | string;
  };

  const ProductReviews: FC<Props>;
  export default ProductReviews;
}

