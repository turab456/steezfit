import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { X, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";


type AuthView =
  | "login"
  | "signup-email"
  | "signup-otp"
  | "forgot-password-email"
  | "forgot-password-otp"
  | "forgot-password-reset";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  initialView?: AuthView;
}

interface FormDataState {
  fullName: string;
  email: string;
  password: string;
  otp: string;
}

interface PasswordRules {
  minLength: number;
  hasUppercase: RegExp;
  hasNumber: RegExp;
  hasSpecialChar: RegExp;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialView,
}) => {
  const [view, setView] = useState<AuthView>("login");
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const [nameError, setNameError] = useState<string>("");

  const passwordRules: PasswordRules = {
    minLength: 8,
    hasUppercase: /[A-Z]/,
    hasNumber: /[0-9]/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/,
  };

  const validatePassword = (password: string): string => {
    if (password.length < passwordRules.minLength) {
      return `Password must be at least ${passwordRules.minLength} characters long`;
    }
    if (!passwordRules.hasUppercase.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!passwordRules.hasNumber.test(password)) {
      return "Password must contain at least one number";
    }
    if (!passwordRules.hasSpecialChar.test(password)) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const validateFullName = (name: string): string => {
    if (!name || name.trim().length < 2) {
      return "Full name must be at least 2 characters long";
    }
    return "";
  };

  const [formData, setFormData] = useState<FormDataState>({
    fullName: "",
    email: "",
    password: "",
    otp: "",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { login, register, verifyOTP, forgotPassword, resetPassword } =
    useAuth();

  const handleInputChange = (field: keyof FormDataState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (value: string) => {
    handleInputChange("password", value);
    if (view !== "login") {
      if (value) {
        setPasswordError(validatePassword(value));
      } else {
        setPasswordError("");
      }
    }
  };

  const handleFullNameChange = (value: string) => {
    handleInputChange("fullName", value);
    if (value) {
      setNameError(validateFullName(value));
    } else {
      setNameError("");
    }
  };

  useEffect(() => {
    if (initialView) {
      setView(initialView);
    }
  }, [initialView]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [isOpen]);

  useEffect(() => {
    setIsPasswordVisible(false);

    if (!isOpen) {
      setTimeout(() => {
        setView("login");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          otp: "",
        });
        setIsLoading(false);
        setPasswordError("");
        setNameError("");
      }, 300);
    }
  }, [isOpen, view]);

  if (!isOpen) return null;

  // --- Authentication Handlers ---

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.success) {
        onClose();
        if (onLoginSuccess) onLoginSuccess();
        return;
      }

      if (result.requiresVerification) {
        toast.info(
          result.message || "Please verify your email using the OTP we sent."
        );
        setView("signup-otp");
        return;
      }

      const errorMessage =
        result.message || "Login failed. Please check your credentials.";

      setFormData((prev) => ({
        ...prev,
        password: "",
      }));

      if (
        errorMessage.toLowerCase().includes("no account found") ||
        errorMessage.toLowerCase().includes("user not found") ||
        errorMessage.toLowerCase().includes("invalid credentials")
      ) {
        toast.error("No account found with this email");

        setTimeout(() => {
          toast.info("Don't have an account? Click here to sign up", {
            autoClose: 5000,
            closeButton: true,
            position: "top-center",
            onClick: () => {
              toast.dismiss();
              setView("signup-email");
            },
          });
        }, 1000);
      } else {
        toast.error(errorMessage);
      }
    } catch (err: any) {
      console.error("Login error:", err);

      setFormData((prev) => ({
        ...prev,
        password: "",
      }));

      const errorMessage =
        err?.message || "An unexpected error occurred during login.";
      toast.error(errorMessage);

      if (
        err?.response?.status === 404 ||
        (err?.message && err.message.toLowerCase().includes("not found"))
      ) {
        setTimeout(() => {
          toast.info("Don't have an account? Click here to sign up", {
            autoClose: 5000,
            closeButton: true,
            position: "top-center",
            onClick: () => {
              toast.dismiss();
              setView("signup-email");
            },
          });
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nameValidationError = validateFullName(formData.fullName);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (result.success || result.requiresVerification) {
        toast.success(
          result.message ||
            `An OTP has been sent to ${formData.email} to verify your account.`
        );
        setView("signup-otp");
        return;
      }
      toast.error(result.message || "Registration failed. Please try again.");
    } catch (err: any) {
      console.error("Registration error:", err);
      toast.error(
        err?.message || "An unexpected error occurred during registration."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await verifyOTP(formData.email, formData.otp);
      if (result.success) {
        toast.success("Account created successfully! Please log in to continue.");
        setView("login");
      } else {
        toast.error(
          result.message ||
            "Invalid OTP. Please check the code and try again."
        );
      }
    } catch (err: any) {
      toast.error(
        err?.message || "An error occurred during OTP verification."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendResetOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await forgotPassword(formData.email);
      if (result.success) {
        toast.success(
          `A password reset code has been sent to ${formData.email}.`
        );
        setView("forgot-password-otp");
      } else {
        toast.error(result.message || "Failed to send reset code.");
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyResetOtp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setView("forgot-password-reset");
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const passwordValidationError = validatePassword(formData.password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPassword(
        formData.email,
        formData.otp,
        formData.password
      );
      if (result.success) {
        toast.success("Password reset successfully! Please log in.");
        setView("login");
      } else {
        toast.error(
          result.message ||
            "Failed to reset password. The code may be invalid or expired."
        );
      }
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Functions for Modal Content ---
  const renderContent = () => {
    switch (view) {
      case "signup-email":
        return (
          <>
            <h2 className="text-xl font-bold text-center text-gray-900">
              Create Account
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Enter your details to get started.
            </p>
            <form onSubmit={handleRegister}>
              <div className="flex flex-col mb-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    nameError
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-black/80"
                  }`}
                />
                {nameError && (
                  <p className="text-xs text-red-500 mt-1">{nameError}</p>
                )}
              </div>
              <div className="relative mb-4">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/80"
                />
              </div>
              <div className="relative mb-1">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/80"
                />
                <button
                  type="button"
                  onClick={() =>
                    setIsPasswordVisible((prevVisible) => !prevVisible)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mb-4">
                <p
                  className={`text-xs ${
                    passwordError ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {passwordError ||
                    "Password must contain at least 8 characters, one uppercase letter, one number, and one special character."}
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200 flex items-center justify-center disabled:bg-gray-400"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Create Account"
                )}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <button
                onClick={() => setView("login")}
                className="font-semibold text-black hover:underline"
              >
                Login
              </button>
            </p>
          </>
        );
      case "signup-otp":
        return (
          <>
            <h2 className="text-xl font-bold text-center text-gray-900">
              Verify Your Email
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              An OTP has been sent to{" "}
              <span className="font-semibold text-black">{formData.email}</span>
              .
            </p>
            <form onSubmit={handleVerifyOtp}>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otp}
                  onChange={(e) => handleInputChange("otp", e.target.value)}
                  required
                  maxLength={6}
                  className="w-full text-center tracking-[0.5em] py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/80"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200 flex items-center justify-center disabled:bg-gray-400"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Verify & Create Account"
                )}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              <button
                onClick={() => setView("signup-email")}
                className="font-semibold text-black hover:underline"
              >
                Back to Sign Up
              </button>
            </p>
          </>
        );
      case "forgot-password-email":
        return (
          <>
            <h2 className="text-xl font-bold text-center text-gray-900">
              Reset Password
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Enter your email to receive a reset code.
            </p>
            <form onSubmit={handleSendResetOtp}>
              <div className="relative mb-4">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/80"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200 flex items-center justify-center disabled:bg-gray-400"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Send Reset Code"
                )}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              <button
                onClick={() => setView("login")}
                className="font-semibold text-black hover:underline"
              >
                Back to Login
              </button>
            </p>
          </>
        );
      case "forgot-password-otp":
        return (
          <>
            <h2 className="text-xl font-bold text-center text-gray-900">
              Check Your Email
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              A reset code was sent to{" "}
              <span className="font-semibold text-black">{formData.email}</span>
              .
            </p>
            <form onSubmit={handleVerifyResetOtp}>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={formData.otp}
                  onChange={(e) => handleInputChange("otp", e.target.value)}
                  required
                  maxLength={6}
                  className="w-full text-center tracking-[0.5em] py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/80"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200 flex items-center justify-center disabled:bg-gray-400"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Continue"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              <button
                onClick={() => setView("forgot-password-email")}
                className="font-semibold text-black hover:underline"
              >
                Change Email
              </button>
            </p>
          </>
        );
      case "forgot-password-reset":
        return (
          <>
            <h2 className="text-xl font-bold text-center text-gray-900">
              Set New Password
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Please enter your new password below.
            </p>
            <form onSubmit={handleResetPassword}>
              <div className="relative mb-1">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="New Password"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/80"
                />
                <button
                  type="button"
                  onClick={() =>
                    setIsPasswordVisible((prevVisible) => !prevVisible)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mb-4">
                <p
                  className={`text-xs ${
                    passwordError ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {passwordError ||
                    "Password must contain at least 8 characters, one uppercase letter, one number, and one special character."}
                </p>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200 flex items-center justify-center disabled:bg-gray-400"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        );
      default:
        return (
          <>
            <h2 className="text-xl font-bold text-center text-gray-900">
              Welcome Back
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Login to continue.
            </p>
            <form onSubmit={handleLogin}>
              <div className="relative mb-4">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/80"
                />
              </div>
              <div className="relative mb-1">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  required
                  className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/80"
                />
                <button
                  type="button"
                  onClick={() =>
                    setIsPasswordVisible((prevVisible) => !prevVisible)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {passwordError && (
                <div className="mb-4">
                  <p className="text-xs text-red-500">{passwordError}</p>
                </div>
              )}
              <div className="text-right mb-4">
                <button
                  type="button"
                  onClick={() => setView("forgot-password-email")}
                  className="text-sm font-semibold text-black hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200 flex items-center justify-center disabled:bg-gray-400"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              Don't have an account?{" "}
              <button
                onClick={() => setView("signup-email")}
                className="font-semibold text-black hover:underline"
              >
                Sign Up
              </button>
            </p>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 transition-opacity duration-300">
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 pt-10 flex flex-col items-center transform transition-all duration-300 scale-100">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-black transition-colors"
          >
            <X size={22} />
          </button>

          {/* Centered Logo */}
          <div className="mb-6 flex flex-col items-center gap-3">
            <img src="/Navbar_logo1.svg" alt="Aesth Co" className="h-14 w-auto" />
          </div>

          {/* Dynamic auth content */}
          <div className="w-full">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
