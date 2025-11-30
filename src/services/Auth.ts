import apiClient from "./ApiClient";

const AUTH_PREFIX = "/auth";

type OtpPayload = {
  email: string;
  fullName?: string;
};

type ProfilePayload = {
  fullName: string;
  phoneNumber?: string;
};

class AuthService {
  sendOtp(payload: OtpPayload) {
    return apiClient.post(`${AUTH_PREFIX}/customer/otp/send`, payload);
  }

  verifyOtp(email: string, otp: string) {
    return apiClient.post(`${AUTH_PREFIX}/customer/otp/verify`, { email, otp });
  }

  resendOtp(email: string) {
    return apiClient.post(`${AUTH_PREFIX}/customer/otp/resend`, { email });
  }

  refreshToken() {
    const refreshToken = apiClient.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    return apiClient.post(`${AUTH_PREFIX}/refresh-token`, { refreshToken });
  }

  completeProfile(profileData: ProfilePayload) {
    return apiClient.put(`${AUTH_PREFIX}/customer/profile`, profileData);
  }

  logout() {
    const refreshToken = apiClient.getRefreshToken();
    if (refreshToken) {
      return apiClient.post(`${AUTH_PREFIX}/logout`, { refreshToken });
    }
    return Promise.resolve({
      success: true,
      message: "Already logged out",
    });
  }
}

const authService = new AuthService();
export default authService;
