import apiClient from "../../../services/ApiClient";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

type ProductReviewParams = {
  page?: number;
  limit?: number;
  rating?: number | null;
};

const unwrap = <T>(response: ApiResponse<T>) => {
  if (!response?.success) {
    throw new Error(response?.message || "Review request failed");
  }
  return response.data;
};

const buildQuery = (params: Record<string, string | number | undefined | null>) => {
  const query = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
  return query ? `?${query}` : "";
};

export const reviewService = {
  async getProductReviews(productId: number | string, params: ProductReviewParams = {}) {
    const query = buildQuery({
      page: params.page,
      limit: params.limit,
      rating: params.rating ?? undefined,
    });
    const response = await apiClient.get(`/reviews/product/${productId}${query}`);
    return unwrap(response as ApiResponse<{ reviews: any[]; summary: any }>);
  },

  async getWritableReviews() {
    const response = await apiClient.get("/reviews/writable");
    return unwrap(
      response as ApiResponse<{ writableReviews: any[]; reviewedReviews: any[] }>
    );
  },

  async createReview(payload: {
    product_id: number | string;
    order_id: string;
    rating: number;
    comment?: string | null;
  }) {
    const response = await apiClient.post("/reviews", payload);
    return unwrap(response as ApiResponse<any>);
  },

  async updateReview(
    id: number | string,
    payload: { rating?: number; comment?: string | null }
  ) {
    const response = await apiClient.put(`/reviews/${id}`, payload);
    return unwrap(response as ApiResponse<any>);
  },

  async deleteReview(id: number | string) {
    const response = await apiClient.delete(`/reviews/${id}`);
    return unwrap(response as ApiResponse<any>);
  },
};

