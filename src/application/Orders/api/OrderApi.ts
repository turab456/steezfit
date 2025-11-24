import apiClient from "../../../services/ApiClient";
import type { ApiResponse, Order, ShippingSetting } from "../types";

const DEFAULT_SHIPPING: ShippingSetting = {
  freeShippingThreshold: 1999,
  shippingFee: 0,
};

const OrderApi = {
  async list(): Promise<Order[]> {
    const response = await apiClient.get("/orders") as ApiResponse<Order[]>;
    return response.data;
  },

  async getById(id: string): Promise<Order> {
    const response = await apiClient.get(`/orders/${id}`) as ApiResponse<Order>;
    return response.data;
  },

  async create(addressId: string): Promise<Order> {
    const response = await apiClient.post("/orders", { addressId }) as ApiResponse<Order>;
    return response.data;
  },

  async getShippingSetting(): Promise<ShippingSetting> {
    try {
      const response = await apiClient.get("/orders/shipping-settings") as ApiResponse<ShippingSetting>;
      return response.data;
    } catch (error) {
      return DEFAULT_SHIPPING;
    }
  },
};

export default OrderApi;
