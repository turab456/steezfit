import { API_BASE_URL } from "../constant";

type RequestOptions = RequestInit & {
  headers?: HeadersInit;
};

const hasDocument = typeof document !== "undefined";
const isSecure = typeof window !== "undefined" && window.location.protocol === "https:";
const cookieBaseOptions = `; path=/; SameSite=Lax${isSecure ? "; Secure" : ""}`;

const setCookie = (name: string, value: string, days = 7) => {
  if (!hasDocument) return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}${cookieBaseOptions}; expires=${expires.toUTCString()}`;
};

const getCookie = (name: string): string | null => {
  if (!hasDocument) return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? match[1] : null;
};

const deleteCookie = (name: string) => {
  if (!hasDocument) return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${cookieBaseOptions}`;
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

  private extractError(response: Response, data: any) {
    const message =
      data?.message ||
      (typeof data === "string" ? data : null) ||
      response.statusText ||
      "Request failed";
    const error = new Error(message) as Error & { status?: number; data?: any };
    error.status = response.status;
    error.data = data;
    return error;
  }

  async request(endpoint: string, options: RequestOptions = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      credentials: "include",
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...this.normalizeHeaders(options.headers),
      },
    };

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
      throw this.extractError(response, data);
    }

    return data;
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
    setCookie("accessToken", encodeURIComponent(accessToken), 1);
    setCookie("refreshToken", encodeURIComponent(refreshToken), 14);
  }

  getAccessToken() {
    const value = getCookie("accessToken");
    return value ? decodeURIComponent(value) : null;
  }

  getRefreshToken() {
    const value = getCookie("refreshToken");
    return value ? decodeURIComponent(value) : null;
  }

  isAuthenticated() {
    return Boolean(this.getAccessToken());
  }

  getUser<T = unknown>() {
    const userStr = getCookie("user");
    return userStr ? (JSON.parse(decodeURIComponent(userStr)) as T) : null;
  }

  setUser(user: unknown) {
    setCookie("user", encodeURIComponent(JSON.stringify(user)), 7);
  }

  clearAuth() {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("user");
  }
}

const apiClient = new ApiClient();
export default apiClient;
