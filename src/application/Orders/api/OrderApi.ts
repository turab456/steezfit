import apiClient from "../../../services/ApiClient";
import type { ApiResponse, Order, ShippingSetting } from "../types";

const DEFAULT_SHIPPING: ShippingSetting = {
  freeShippingThreshold: 1999,
  shippingFee: 0,
};

const normalizeShipping = (setting: ShippingSetting): ShippingSetting => ({
  freeShippingThreshold: Number(setting.freeShippingThreshold ?? 0),
  shippingFee: Number(setting.shippingFee ?? 0),
  isActive: setting.isActive ?? true,
})

const OrderApi = {
  async list(): Promise<Order[]> {
    const response = await apiClient.get("/orders") as ApiResponse<Order[]>;
    return response.data;
  },

  async recent(): Promise<Order[]> {
    const response = await apiClient.get("/orders/recent") as ApiResponse<Order[]>;
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await apiClient.get(`/orders/${id}`) as ApiResponse<Order>;
    return response.data;
  },

  async create(addressId: string, couponCode?: string): Promise<Order> {
    const payload = couponCode ? { addressId, couponCode } : { addressId };
    const response = await apiClient.post("/orders", payload) as ApiResponse<Order>;
    return response.data;
  },

  async cancel(id: string): Promise<Order> {
    const response = await apiClient.patch(`/orders/${id}/cancel`, {}) as ApiResponse<Order>;
    return response.data;
  },

  async getShippingSetting(): Promise<ShippingSetting> {
    try {
      const response = await apiClient.get("/orders/shipping-settings") as ApiResponse<ShippingSetting>;
      return normalizeShipping(response.data);
    } catch (error) {
      return DEFAULT_SHIPPING;
    }
  },
};

export default OrderApi;
