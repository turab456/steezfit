import apiClient from "../../../services/ApiClient";
import type { UserProfile } from "../types";
import type { UserAddress } from "../types";

export const ProfileApi = {
  async fetchProfile(): Promise<UserProfile> {
    const res = await apiClient.get("/auth/me");
    return (res as any)?.data ?? res;
  },

  async fetchAddresses(): Promise<UserAddress[]> {
    const res = await apiClient.get("/user/addresses");
    return (res as any)?.data ?? res;
  },
};

export default ProfileApi;
