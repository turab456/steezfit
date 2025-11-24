import apiClient from "../../../services/ApiClient";
import type { CouponValidation, AvailableCoupon } from "../types";

const CouponApi = {
  async validate(code: string, orderAmount: number): Promise<CouponValidation> {
    const response: any = await apiClient.post("/coupons/validate", {
      code,
      orderAmount,
    });

    const data = response?.data ?? response;
    return {
      code: data.coupon?.code || code,
      discountAmount: Number(data.discountAmount || 0),
      type: data.coupon?.type ?? undefined,
      message: data.remainingGlobal !== undefined
        ? `Applied. Remaining uses: ${data.remainingGlobal ?? "unlimited"}.`
        : "Coupon applied.",
    };
  },

  async listAvailable(): Promise<AvailableCoupon[]> {
    const response: any = await apiClient.get("/coupons/available");
    return response?.data ?? response ?? [];
  },
};

export default CouponApi;
