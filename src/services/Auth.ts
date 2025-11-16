import apiClient from "./ApiClient";

type RegisterPayload = Record<string, unknown>;

type LoginPayload = {
  email: string;
  password: string;
};

class AuthService {
  register(userData: RegisterPayload) {
    return apiClient.post("/auth/register", userData);
  }

  verifyOTP(email: string, otp: string) {
    return apiClient.post("/auth/verify-otp", { email, otp });
  }

  login(credentials: LoginPayload) {
    return apiClient.post("/auth/login", credentials);
  }

  forgotPassword(email: string) {
    return apiClient.post("/auth/forgot-password", { email });
  }

  resetPassword(email: string, otp: string, newPassword: string) {
    return apiClient.post("/auth/reset-password", { email, otp, newPassword });
  }

  refreshToken() {
    const refreshToken = apiClient.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    return apiClient.post("/auth/refresh-token", { refreshToken });
  }

  logout() {
    const refreshToken = apiClient.getRefreshToken();
    if (!refreshToken) {
      return Promise.resolve({
        success: true,
        message: "Already logged out",
      });
    }

    return apiClient.post("/auth/logout", { refreshToken });
  }
}

const authService = new AuthService();
export default authService;
