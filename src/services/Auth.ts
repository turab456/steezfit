import apiClient from "./ApiClient";

const AUTH_PREFIX = "/auth";

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

class AuthService {
  registerCustomer(userData: RegisterPayload) {
    return apiClient.post(`${AUTH_PREFIX}/register/customer`, userData);
  }

  verifyOTP(email: string, otp: string) {
    return apiClient.post(`${AUTH_PREFIX}/verify-otp`, { email, otp });
  }

  loginCustomer(credentials: LoginPayload) {
    return apiClient.post(`${AUTH_PREFIX}/login/customer`, credentials);
  }

  forgotPassword(email: string) {
    return apiClient.post(`${AUTH_PREFIX}/forgot-password`, { email });
  }

  resetPassword(email: string, otp: string, newPassword: string) {
    return apiClient.post(`${AUTH_PREFIX}/reset-password`, {
      email,
      otp,
      newPassword,
    });
  }

  refreshToken() {
    const refreshToken = apiClient.getRefreshToken();
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }
    return apiClient.post(`${AUTH_PREFIX}/refresh-token`, { refreshToken });
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
