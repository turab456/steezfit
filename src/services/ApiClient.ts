import { API_BASE_URL } from "../constant";

type RequestOptions = RequestInit & {
  headers?: HeadersInit;
};

class ApiClient {
  private baseURL: string;

  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getAccessToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private normalizeHeaders(headers?: HeadersInit): Record<string, string> {
    if (!headers) {
      return {};
    }

    if (headers instanceof Headers) {
      return Object.fromEntries(headers.entries());
    }

    if (Array.isArray(headers)) {
      return headers.reduce<Record<string, string>>((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
    }

    return headers;
  }

  async request(endpoint: string, options: RequestOptions = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...this.normalizeHeaders(options.headers),
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 204) {
        return { success: true, data: null, message: "Deleted successfully" };
      }

      let data: unknown = null;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw data ?? { message: "Request failed" };
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  get(endpoint: string) {
    return this.request(endpoint);
  }

  post(endpoint: string, body: unknown, options: RequestOptions = {}) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    });
  }

  put(endpoint: string, body: unknown, options: RequestOptions = {}) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    });
  }

  delete(endpoint: string, options: RequestOptions = {}) {
    return this.request(endpoint, {
      method: "DELETE",
      ...options,
    });
  }

  updateProfile(profileData: Record<string, unknown>) {
    return this.post("/user/update-profile", profileData);
  }

  changePassword(passwordData: Record<string, string>) {
    return this.post("/user/change-password", passwordData);
  }

  getProfile() {
    return this.get("/user/profile");
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
  }

  getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  getRefreshToken() {
    return localStorage.getItem("refreshToken");
  }

  isAuthenticated() {
    return Boolean(this.getAccessToken());
  }

  getUser<T = unknown>() {
    const userStr = localStorage.getItem("user");
    return userStr ? (JSON.parse(userStr) as T) : null;
  }

  setUser(user: unknown) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  clearAuth() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
}

const apiClient = new ApiClient();
export default apiClient;
