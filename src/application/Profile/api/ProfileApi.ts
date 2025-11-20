import apiClient from "../../../services/ApiClient";
import type { UserProfile } from "../types";

export const ProfileApi = {
  async fetchProfile(): Promise<UserProfile> {
    const res = await apiClient.get("/auth/me");
    return (res as any)?.data ?? res;
  },

  async changePassword(email: string, otp: string, newPassword: string) {
    return apiClient.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
  },
};

export default ProfileApi;
