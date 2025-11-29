import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { X, Mail, Loader2, Phone, User as UserIcon } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../contexts/AuthContext";

type AuthView = "request-otp" | "verify-otp" | "complete-profile";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  initialView?: AuthView;
}

interface FormDataState {
  email: string;
  otp: string;
  fullName: string;
  phoneNumber: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialView,
}) => {
  const [view, setView] = useState<AuthView>("request-otp");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>("");
  const [generalError, setGeneralError] = useState<string>("");
  const [formData, setFormData] = useState<FormDataState>({
    email: "",
    otp: "",
    fullName: "",
    phoneNumber: "",
  });

  const { requestOtp, verifyOtp, completeProfile } = useAuth();

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
    if (!isOpen) {
      setTimeout(() => {
        setView("request-otp");
        setFormData({
          email: "",
          otp: "",
          fullName: "",
          phoneNumber: "",
        });
        setIsLoading(false);
      }, 200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof FormDataState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleRequestOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError("");
    const result = await requestOtp({ email: formData.email });
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message || "OTP sent to your email");
      setView("verify-otp");
      return;
    }

    const errorMessage = result.message || "Failed to send OTP. Please try again.";
    setGeneralError(errorMessage);
    toast.error(errorMessage);
  };

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGeneralError("");
    const result = await verifyOtp(formData.email, formData.otp);
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message || "Logged in successfully.");

      if (result.requiresProfile) {
        setView("complete-profile");
        return;
      }

      onClose();
      onLoginSuccess?.();
      return;
    }

    const errorMessage = result.message || "Invalid OTP. Please try again.";
    setGeneralError(errorMessage);
    toast.error(errorMessage);
  };

  const handleCompleteProfile = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      const errorMsg = "Full name is required.";
      setGeneralError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setIsLoading(true);
    setGeneralError("");
    const result = await completeProfile({
      fullName: formData.fullName.trim(),
      phoneNumber: formData.phoneNumber.trim() || undefined,
    });
    setIsLoading(false);

    if (result.success) {
      toast.success(result.message || "Profile updated.");
      onClose();
      onLoginSuccess?.();
      return;
    }

    const errorMessage = result.message || "Failed to update profile.";
    setGeneralError(errorMessage);
    toast.error(errorMessage);
  };

  const renderContent = () => {
    switch (view) {
      case "verify-otp":
        return (
          <>
            <h2 className="text-xl font-bold text-center text-gray-900">
              Enter OTP
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              We sent a 6-digit code to{" "}
              <span className="font-semibold text-black">{formData.email}</span>
            </p>
            <form onSubmit={handleVerifyOtp}>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="ENTER OTP"
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
                {isLoading ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-4">
              <button
                onClick={() => setView("request-otp")}
                className="font-semibold text-black hover:underline"
              >
                Change email
              </button>
            </p>
          </>
        );
      case "complete-profile":
        return (
          <>
            <h2 className="text-xl font-bold text-center text-gray-900">
              Complete Profile
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Add your name and phone (optional) to finish signing in.
            </p>
            <form onSubmit={handleCompleteProfile}>
              <div className="relative mb-4">
                <UserIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/80"
                />
              </div>
              <div className="relative mb-4">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="tel"
                  placeholder="Phone (optional)"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/80"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200 flex items-center justify-center disabled:bg-gray-400"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : "Save & Continue"}
              </button>
            </form>
          </>
        );
      default:
        return (
          <>
            <h2 className="text-xl font-bold text-center text-gray-900">
              Sign in or Sign up
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Enter your email to receive a one-time password.
            </p>
            <form onSubmit={handleRequestOtp}>
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
                {isLoading ? <Loader2 className="animate-spin" /> : "Send OTP"}
              </button>
            </form>
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

          <div className="mb-6 flex flex-col items-center gap-3">
            <img src="/Navbar_logo1.svg" alt="Aesth Co" className="h-14 w-auto" />
          </div>

          {generalError && (
            <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center font-medium">{generalError}</p>
            </div>
          )}

          <div className="w-full">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
