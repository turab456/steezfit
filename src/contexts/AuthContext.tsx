import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../services/ApiClient";
import authService from "../services/Auth";

type User = {
  fullName?: string;
  email?: string;
  role?: string;
  phoneNumber?: string;
  [key: string]: any;
};

type OtpRequest = {
  email: string;
  fullName?: string;
};

type CompleteProfilePayload = {
  fullName: string;
  phoneNumber?: string;
};

type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  requestOtp: (payload: OtpRequest) => Promise<{ success: boolean; message: string }>;
  resendOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (
    email: string,
    otp: string
  ) => Promise<{ success: boolean; message: string; requiresProfile?: boolean }>;
  completeProfile: (
    payload: CompleteProfilePayload
  ) => Promise<{ success: boolean; message: string }>;
  registerCustomer: (payload: RegisterPayload) => Promise<{ success: boolean; message: string }>;
  verifyEmailOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  loginWithPassword: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  sendForgotPasswordOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyForgotPasswordOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
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

        // If access token is missing but refresh token exists, try refreshing
        if (!token && apiClient.getRefreshToken()) {
          const refreshed = await refreshAuth();
          if (refreshed && apiClient.getUser()) {
            setUser(apiClient.getUser());
            setIsAuthenticated(true);
            return;
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

  const buildErrorMessage = (error: any, fallback: string) =>
    error?.data?.message ||
    error?.message ||
    error?.response?.data?.message ||
    fallback;

  const applySession = (userData: any, accessToken?: string, refreshToken?: string) => {
    if (accessToken && refreshToken) {
      apiClient.setTokens(accessToken, refreshToken);
    }
    if (userData) {
      apiClient.setUser(userData);
      setUser(userData);
      setIsAuthenticated(true);
    }
  };

  const loginWithPassword = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.loginWithPassword({ email, password });

      if (response.success && response.data?.user && response.data?.accessToken && response.data?.refreshToken) {
        applySession(response.data.user, response.data.accessToken, response.data.refreshToken);
        navigate("/");
        return { success: true, message: response.message || "Logged in" };
      }

      return { success: false, message: response.message || "Login failed" };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        message: buildErrorMessage(error, "Login failed"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const registerCustomer = async (
    payload: RegisterPayload
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.registerCustomer(payload);
      return {
        success: Boolean(response.success),
        message: response.message || "Registered successfully. Verify OTP sent to email.",
      };
    } catch (error: any) {
      console.error("Register error:", error);
      return {
        success: false,
        message: buildErrorMessage(error, "Registration failed"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailOtp = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.verifyEmailOtp(email, otp);
      return {
        success: Boolean(response.success),
        message: response.message || "Email verified",
      };
    } catch (error: any) {
      console.error("Verify email OTP error:", error);
      return {
        success: false,
        message: buildErrorMessage(error, "OTP verification failed"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const requestOtp = async (
    payload: OtpRequest
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.sendOtp(payload);

      return {
        success: Boolean(response.success),
        message: response.message || "OTP sent to your email",
      };
    } catch (error: any) {
      console.error("Request OTP error:", error);
      return {
        success: false,
        message: buildErrorMessage(error, "Failed to send OTP"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.resendOtp(email);

      return {
        success: Boolean(response.success),
        message: response.message || "A new OTP has been sent to your email",
      };
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      return {
        success: false,
        message: buildErrorMessage(error, "Failed to resend OTP"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (
    email: string,
    otp: string
  ): Promise<{ success: boolean; message: string; requiresProfile?: boolean }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.verifyOtp(email, otp);

      if (response.success && response.data?.accessToken && response.data?.refreshToken) {
        const { user: userData, accessToken, refreshToken, requiresProfile } = response.data;

        applySession(userData, accessToken, refreshToken);

        if (!requiresProfile) {
          navigate("/");
        }

        return {
          success: true,
          message: response.message || "Login successful",
          requiresProfile,
        };
      }

      return {
        success: false,
        message: response.message || "OTP verification failed",
      };
    } catch (error: any) {
      console.error("Verify OTP error:", error);
      return {
        success: false,
        message: buildErrorMessage(error, "OTP verification failed"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfile = async (
    payload: CompleteProfilePayload
  ): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      const response: any = await authService.completeProfile(payload);

      if (response.success) {
        const updatedUser = {
          ...(user || {}),
          ...(response.data || {}),
        };

        setUser(updatedUser);
        apiClient.setUser(updatedUser);
        setIsAuthenticated(true);

        return {
          success: true,
          message: response.message || "Profile updated",
        };
      }

      return {
        success: false,
        message: response.message || "Failed to update profile",
      };
    } catch (error: any) {
      console.error("Complete profile error:", error);
      return {
        success: false,
        message: buildErrorMessage(error, "Failed to update profile"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const sendForgotPasswordOtp = async (email: string) => {
    try {
      setIsLoading(true);
      const response: any = await authService.sendForgotPasswordOtp(email);
      return {
        success: Boolean(response.success),
        message: response.message || "OTP sent if email exists.",
      };
    } catch (error: any) {
      console.error("Forgot password OTP error:", error);
      return {
        success: false,
        message: buildErrorMessage(error, "Failed to send OTP"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyForgotPasswordOtp = async (email: string, otp: string) => {
    try {
      setIsLoading(true);
      const response: any = await authService.verifyForgotPasswordOtp(email, otp);
      return {
        success: Boolean(response.success),
        message: response.message || "OTP verified",
      };
    } catch (error: any) {
      console.error("Verify reset OTP error:", error);
      return {
        success: false,
        message: buildErrorMessage(error, "Invalid OTP"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      setIsLoading(true);
      const response: any = await authService.resetPassword(email, otp, newPassword);
      return {
        success: Boolean(response.success),
        message: response.message || "Password updated",
      };
    } catch (error: any) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message: buildErrorMessage(error, "Unable to reset password"),
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      toast.success("Signed out");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Error while signing out");
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
    requestOtp,
    resendOtp,
    verifyOtp,
    completeProfile,
    registerCustomer,
    verifyEmailOtp,
    loginWithPassword,
    sendForgotPasswordOtp,
    verifyForgotPasswordOtp,
    resetPassword,
    logout,
    refreshAuth,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
