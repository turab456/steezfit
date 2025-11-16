import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../services/ApiClient";
import authService from "../services/Auth";

type User = {
  role?: string;
  // Add any other fields your backend returns
  [key: string]: any;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterUserData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    userData: RegisterUserData
  ) => Promise<{ success: boolean; message: string; data?: any }>;
  verifyOTP: (email: string, otp: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  forgotPassword: (email: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean | undefined>;
  updateUser: (userData: Partial<User>) => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = apiClient.getAccessToken();
        const storedUser = apiClient.getUser();

        if (token && storedUser) {
          setUser(storedUser);
          setIsAuthenticated(true);

          // Verify token is still valid by getting profile
          try {
            await apiClient.getProfile();
          } catch (error) {
            // Token is invalid, clear auth
            apiClient.clearAuth();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        apiClient.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    credentials: LoginCredentials
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.login(credentials);

      if (response.success) {
        const { user: userData, accessToken, refreshToken } = response.data;

        // Store tokens and user data
        apiClient.setTokens(accessToken, refreshToken);
        apiClient.setUser(userData);

        setUser(userData);
        setIsAuthenticated(true);

        // Redirect based on role
        if (userData.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }

        return { success: true, message: "Login successful" };
      } else {
        // Handle case when login fails
        return {
          success: false,
          message: response.message || "Invalid email or password",
        };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // Check for 404 or other specific error statuses
      if (
        error.response?.status === 404 ||
        error.message?.toLowerCase().includes("not found")
      ) {
        return {
          success: false,
          message: "No account found with this email. Please sign up.",
        };
      }
      return {
        success: false,
        message: error.message || "Login failed. Please try again.",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: RegisterUserData
  ): Promise<{ success: boolean; message: string; data?: any }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.register(userData);

      if (response.success) {
        return {
          success: true,
          message: response.message,
          data: response.data,
        };
      }

      // If backend returns success: false but no error thrown
      return {
        success: false,
        message: response.message || "Registration failed",
      };
    } catch (error: any) {
      // Handle case when user already exists
      if (error.message && error.message.includes("already exists")) {
        return {
          success: false,
          message:
            "An account with this email already exists. Please sign in instead.",
        };
      }
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.message || "Registration failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.verifyOTP(email, otp);

      if (response.success) {
        return {
          success: true,
          message: response.message,
        };
      }

      return {
        success: false,
        message: response.message || "OTP verification failed",
      };
    } catch (error: any) {
      console.error("OTP verification error:", error);
      return {
        success: false,
        message: error.message || "OTP verification failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (
    email: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.forgotPassword(email);

      if (response.success) {
        return {
          success: true,
          message: response.message,
        };
      }

      return {
        success: false,
        message: response.message || "Failed to send reset email",
      };
    } catch (error: any) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        message: error.message || "Failed to send reset email",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.resetPassword(
        email,
        otp,
        newPassword
      );

      if (response.success) {
        return {
          success: true,
          message: response.message,
        };
      }

      return {
        success: false,
        message: response.message || "Password reset failed",
      };
    } catch (error: any) {
      console.error("Password reset error:", error);
      return {
        success: false,
        message: error.message || "Password reset failed",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state regardless of API call success
      apiClient.clearAuth();
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate("/");
    }
  };

  const refreshAuth = async (): Promise<boolean | undefined> => {
    try {
      const response: any = await authService.refreshToken();
      if (response.success) {
        const refreshToken = apiClient.getRefreshToken();
        if (!refreshToken) {
          throw new Error("Missing refresh token");
        }
        apiClient.setTokens(response.data.accessToken, refreshToken);
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      await logout();
      return false;
    }
  };

  const updateUser = (userData: Partial<User>): void => {
    setUser((prevUser) => ({
      ...(prevUser || {}),
      ...userData,
    }));

    apiClient.setUser({
      ...(user || {}),
      ...userData,
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    verifyOTP,
    forgotPassword,
    resetPassword,
    logout,
    refreshAuth,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
