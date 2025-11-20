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
  fullName?: string;
  email?: string;
  role?: string;
  [key: string]: any;
};

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterUserData = {
  fullName: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    credentials: LoginCredentials
  ) => Promise<{
    success: boolean;
    message: string;
    requiresVerification?: boolean;
    email?: string;
  }>;
  register: (
    userData: RegisterUserData
  ) => Promise<{
    success: boolean;
    message: string;
    data?: any;
    requiresVerification?: boolean;
    email?: string;
  }>;
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
          return;
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

  const buildErrorMessage = (error: any, fallback: string) =>
    error?.data?.message ||
    error?.message ||
    error?.response?.data?.message ||
    fallback;

  const login = async (
    credentials: LoginCredentials
  ): Promise<{
    success: boolean;
    message: string;
    requiresVerification?: boolean;
    email?: string;
  }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.loginCustomer(credentials);

      if (response.success && response.data?.accessToken && response.data?.refreshToken) {
        const { user: userData, accessToken, refreshToken } = response.data;

        apiClient.setTokens(accessToken, refreshToken);
        apiClient.setUser(userData);

        setUser(userData);
        setIsAuthenticated(true);

        navigate("/");

        return { success: true, message: response.message || "Login successful" };
      }

      if (response.success && !response.data?.accessToken) {
        return {
          success: false,
          message: response.message || "Please verify your email to continue.",
          requiresVerification: true,
          email: credentials.email,
        };
      }

      return {
        success: false,
        message: response.message || "Invalid email or password",
      };
    } catch (error: any) {
      console.error("Login error:", error);
      const message = buildErrorMessage(error, "Login failed. Please try again.");
      return {
        success: false,
        message,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    userData: RegisterUserData
  ): Promise<{
    success: boolean;
    message: string;
    data?: any;
    requiresVerification?: boolean;
    email?: string;
  }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.registerCustomer(userData);

      if (response.success) {
        return {
          success: true,
          message: response.message,
          data: response.data,
          requiresVerification: true,
          email: userData.email,
        };
      }

      return {
        success: false,
        message: response.message || "Registration failed",
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: buildErrorMessage(error, "Registration failed"),
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
        message: buildErrorMessage(error, "OTP verification failed"),
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
        message: buildErrorMessage(error, "Failed to send reset email"),
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
        message: buildErrorMessage(error, "Password reset failed"),
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
