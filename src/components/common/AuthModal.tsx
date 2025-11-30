import React, { useEffect, useMemo, useState, useRef } from "react";
import type { FormEvent, ClipboardEvent, KeyboardEvent, ChangeEvent } from "react";
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";

type Tab = "signin" | "signup";
// Added "forgot-email" to separate the input step
type Step = "form" | "verify-register" | "forgot-email" | "verify-forgot" | "reset-password";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  initialView?: 'request-otp' | 'verify-otp' | 'complete-profile';
};

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  otp: "",
  newPassword: "",
  confirmNewPassword: "",
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess, initialView }) => {
  const [tab, setTab] = useState<Tab>("signin");
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Timers
  const [resendTimer, setResendTimer] = useState(0);
  const [resendTimerForgot, setResendTimerForgot] = useState(0);
  
  // Visibility Toggles
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirm, setShowSignupConfirm] = useState(false);

  // OTP State for the 6 boxes
  const [otpValues, setOtpValues] = useState<string[]>(new Array(6).fill(""));
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const {
    loginWithPassword,
    registerCustomer,
    verifyEmailOtp,
    sendForgotPasswordOtp,
    verifyForgotPasswordOtp,
    resetPassword,
  } = useAuth();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setTab("signin");
        setStep("form");
        setForm(initialForm);
        setOtpValues(new Array(6).fill(""));
        setError("");
        setResendTimer(0);
        setResendTimerForgot(0);
      }, 200);
    }
  }, [isOpen]);

  // Sync OTP array to form.otp string
  useEffect(() => {
    setField("otp", otpValues.join(""));
  }, [otpValues]);

  // Timer Logic
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = window.setInterval(() => setResendTimer((prev) => Math.max(prev - 1, 0)), 1000);
    return () => window.clearInterval(t);
  }, [resendTimer]);

  useEffect(() => {
    if (resendTimerForgot <= 0) return;
    const t = window.setInterval(
      () => setResendTimerForgot((prev) => Math.max(prev - 1, 0)),
      1000
    );
    return () => window.clearInterval(t);
  }, [resendTimerForgot]);

  const setField = (key: keyof typeof form, value: string) => {
    setError("");
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // --- OTP HANDLERS (Paste, Type, Backspace) ---
  const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return; // Only numbers

    const newOtp = [...otpValues];
    // Take the last character entered (in case user types fast)
    newOtp[index] = value.substring(value.length - 1);
    setOtpValues(newOtp);

    // Move to next input if value exists
    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0 && otpInputRefs.current[index - 1]) {
      // If empty and backspace pressed, move to previous
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return; // Only digits

    const digits = pastedData.split("");
    const newOtp = [...otpValues];
    
    digits.forEach((digit, idx) => {
      if (idx < 6) newOtp[idx] = digit;
    });
    
    setOtpValues(newOtp);
    
    // Focus the box after the last pasted digit
    const nextIndex = Math.min(digits.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };
  // ---------------------------------------------

  const disableSubmit = useMemo(() => {
    if (isLoading) return true;
    if (tab === "signin") {
      if (step === "forgot-email") return !form.email;
      if (step === "verify-forgot") return form.otp.length < 6;
      if (step === "reset-password") return !form.newPassword || form.newPassword !== form.confirmNewPassword;
      return !form.email || !form.password;
    }
    if (tab === "signup") {
      if (step === "verify-register") return form.otp.length < 6;
      return !form.fullName || !form.email || !form.password || form.password !== form.confirmPassword;
    }
    return false;
  }, [form, isLoading, step, tab]);

  // --- API HANDLERS ---

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    if (disableSubmit) return;
    setIsLoading(true);
    const res = await loginWithPassword(form.email.trim(), form.password);
    setIsLoading(false);
    if (res.success) {
      toast.success(res.message || "Signed in successfully");
      onClose();
      onLoginSuccess?.();
    } else {
      setError(res.message);
      toast.error(res.message);
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (disableSubmit) return;
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    const res = await registerCustomer({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      password: form.password,
    });
    setIsLoading(false);
    if (res.success) {
      toast.success("Verification code sent to your email");
      setOtpValues(new Array(6).fill("")); // Clear OTP
      setStep("verify-register");
      setResendTimer(30);
    } else {
      setError(res.message);
      toast.error(res.message);
    }
  };

  const handleVerifyRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (form.otp.length < 6) return;
    setIsLoading(true);
    const res = await verifyEmailOtp(form.email.trim(), form.otp.trim());
    setIsLoading(false);
    if (res.success) {
      toast.success("Email verified successfully");
      const loginRes = await loginWithPassword(form.email.trim(), form.password);
      if (loginRes.success) {
        onClose();
        onLoginSuccess?.();
      } else {
        toast.error(loginRes.message);
      }
    } else {
      setError(res.message);
      setOtpValues(new Array(6).fill(""));
      toast.error(res.message);
    }
  };

  const handleForgotSend = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!form.email) {
      setError("Please enter your email address.");
      return;
    }
    setIsLoading(true);
    const res = await sendForgotPasswordOtp(form.email.trim());
    setIsLoading(false);
    if (res.success) {
      toast.success(res.message || "Reset code sent");
      setOtpValues(new Array(6).fill("")); // Clear OTP
      setStep("verify-forgot");
      setResendTimerForgot(30);
    } else {
      setError(res.message);
      toast.error(res.message);
    }
  };

  const handleVerifyForgot = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await verifyForgotPasswordOtp(form.email.trim(), form.otp.trim());
    setIsLoading(false);
    if (res.success) {
      toast.success("Code verified");
      setStep("reset-password");
    } else {
      setError(res.message);
      setOtpValues(new Array(6).fill(""));
      toast.error(res.message);
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setIsLoading(true);
    const res = await resetPassword(form.email.trim(), form.otp.trim(), form.newPassword);
    setIsLoading(false);
    if (res.success) {
      toast.success("Password reset successfully. Please sign in.");
      setTab("signin");
      setStep("form");
      setForm(initialForm);
    } else {
      setError(res.message);
      toast.error(res.message);
    }
  };

  const handleResend = () => {
    if (tab === "signup" && resendTimer === 0) {
      void registerCustomer({
        fullName: form.fullName.trim() || "Customer",
        email: form.email.trim(),
        password: form.password,
      });
      setResendTimer(30);
      toast.info("Verification code resent");
    }
    if (tab === "signin" && step === "verify-forgot" && resendTimerForgot === 0) {
      void sendForgotPasswordOtp(form.email.trim());
      setResendTimerForgot(30);
      toast.info("Reset code resent");
    }
  };

  if (!isOpen) return null;

  // --- RENDER HELPERS ---
  
  const renderOtpInputs = () => (
    <div className="flex w-full items-center justify-between gap-2">
      {otpValues.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => { otpInputRefs.current[idx] = el; }}
          type="text"
          value={digit}
          onChange={(e) => handleOtpChange(e, idx)}
          onKeyDown={(e) => handleOtpKeyDown(e, idx)}
          onPaste={handleOtpPaste}
          maxLength={1}
          className="h-12 w-full rounded-lg border border-gray-200 bg-white text-center text-lg font-bold text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
        />
      ))}
    </div>
  );

  const getHeaderContent = () => {
    if (step === "forgot-email") return { title: "Forgot Password?", sub: "Enter email to reset" };
    if (step === "verify-forgot" || step === "verify-register") return { title: "Verify Email", sub: `Code sent to ${form.email}` };
    if (step === "reset-password") return { title: "New Password", sub: "Create a strong password" };
    if (tab === "signup") return { title: "Create Account", sub: "Join us for exclusive offers" };
    return { title: "Welcome Back", sub: "Sign in to access your account" };
  };

  const { title, sub } = getHeaderContent();

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        
        {/* Header Section */}
        <div className="flex flex-col items-center border-b border-gray-100 bg-white px-8 py-8 pt-10 text-center">
          <img src="/navbar_logo1.svg" alt="Logo" className="h-10 w-auto mb-6" />
          
          <h2 className="text-xl font-bold tracking-tight text-gray-900">{title}</h2>
          <p className="mt-1 text-sm text-gray-500">{sub}</p>

          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="px-8 py-6">
          {error && (
            <div className="mb-6 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <div className="mt-0.5"><X size={14} /></div>
              {error}
            </div>
          )}

          {/* SIGN IN FORM */}
          {tab === "signin" && step === "form" && (
            <form onSubmit={handleSignIn} className="space-y-4">
               {/* Tab Switcher */}
              <div className="mb-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setTab("signin")}
                  className="rounded-md bg-white py-2 text-sm font-semibold text-black shadow-sm"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab("signup");
                    setForm(initialForm);
                    setError("");
                  }}
                  className="rounded-md py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition"
                >
                  Sign Up
                </button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type={showSigninPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 pl-10 pr-10 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSigninPassword(!showSigninPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showSigninPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setStep("forgot-email");
                    setForm(prev => ({ ...prev, email: "" })); // Optional: Clear email or keep it
                    setError("");
                  }}
                  className="text-xs font-semibold text-gray-600 hover:text-black hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={disableSubmit}
                className="w-full rounded-lg bg-black py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign In
              </button>
            </form>
          )}

          {/* FORGOT PASSWORD: STEP 1 (Email Input) */}
          {tab === "signin" && step === "forgot-email" && (
            <form onSubmit={handleForgotSend} className="space-y-6">
               <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    autoFocus
                    className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={disableSubmit}
                    className="w-full rounded-lg bg-black py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Send Reset Code
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form");
                      setError("");
                    }}
                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 py-2"
                  >
                    <ArrowLeft size={16} /> Back to Sign In
                  </button>
                </div>
            </form>
          )}

          {/* FORGOT PASSWORD: STEP 2 (OTP) */}
          {tab === "signin" && step === "verify-forgot" && (
            <form onSubmit={handleVerifyForgot} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Enter 6-digit code</label>
                 {renderOtpInputs()}
               </div>

               <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={disableSubmit}
                    className="w-full rounded-lg bg-black py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Verify Code
                  </button>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => setStep("forgot-email")}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      Change Email
                    </button>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendTimerForgot > 0}
                      className="flex items-center gap-1.5 font-medium text-gray-900 disabled:text-gray-400"
                    >
                       <RefreshCw size={14} className={resendTimerForgot > 0 ? "animate-spin" : ""} />
                       {resendTimerForgot > 0 ? `Resend in ${resendTimerForgot}s` : "Resend Code"}
                    </button>
                  </div>
               </div>
            </form>
          )}

           {/* FORGOT PASSWORD: STEP 3 (New Password) */}
           {tab === "signin" && step === "reset-password" && (
             <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={form.newPassword}
                    onChange={(e) => setField("newPassword", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={form.confirmNewPassword}
                    onChange={(e) => setField("confirmNewPassword", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={disableSubmit}
                  className="w-full rounded-lg bg-black py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Update Password
                </button>
             </form>
           )}

          {/* SIGN UP FORM */}
          {tab === "signup" && step === "form" && (
            <form onSubmit={handleSignUp} className="space-y-4">
               {/* Tab Switcher */}
              <div className="mb-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setTab("signin");
                    setStep("form");
                    setForm(initialForm);
                    setError("");
                  }}
                  className="rounded-md py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className="rounded-md bg-white py-2 text-sm font-semibold text-black shadow-sm"
                >
                  Sign Up
                </button>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Password"
                      value={form.password}
                      onChange={(e) => setField("password", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 pl-10 pr-8 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                     <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="absolute right-2 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input
                      type={showSignupConfirm ? "text" : "password"}
                      placeholder="Confirm"
                      value={form.confirmPassword}
                      onChange={(e) => setField("confirmPassword", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 pl-10 pr-8 py-3 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                    />
                    <button
                        type="button"
                        onClick={() => setShowSignupConfirm(!showSignupConfirm)}
                        className="absolute right-2 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showSignupConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={disableSubmit}
                className="w-full rounded-lg bg-black py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Account
              </button>
            </form>
          )}

           {/* VERIFY SIGN UP OTP */}
           {tab === "signup" && step === "verify-register" && (
             <form onSubmit={handleVerifyRegister} className="space-y-6">
                <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                   <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                   <p>A verification code has been sent to <strong>{form.email}</strong>. Please enter it below.</p>
                </div>

                <div className="space-y-2">
                 <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Enter 6-digit code</label>
                 {renderOtpInputs()}
               </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={disableSubmit}
                    className="w-full rounded-lg bg-black py-3 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Verify Email
                  </button>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      Change Email
                    </button>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendTimer > 0}
                      className="flex items-center gap-1.5 font-medium text-gray-900 disabled:text-gray-400"
                    >
                       <RefreshCw size={14} className={resendTimer > 0 ? "animate-spin" : ""} />
                       {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                    </button>
                  </div>
                </div>
             </form>
           )}

        </div>
      </div>
    </div>
  );
};

export default AuthModal;







// import React, { useEffect, useMemo, useState } from "react";
// import type { FormEvent } from "react";
// import {
//   X,
//   Mail,
//   Lock,
//   User as UserIcon,
//   Loader2,
//   RefreshCw,
//   ShieldCheck,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import { toast } from "react-toastify";
// import { useAuth } from "../../contexts/AuthContext";

// type Tab = "signin" | "signup";
// type Step = "form" | "verify-register" | "verify-forgot" | "reset-password";

// type AuthModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
//   onLoginSuccess?: () => void;
// };

// const initialForm = {
//   fullName: "",
//   email: "",
//   password: "",
//   confirmPassword: "",
//   otp: "",
//   newPassword: "",
//   confirmNewPassword: "",
// };

// const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
//   const [tab, setTab] = useState<Tab>("signin");
//   const [step, setStep] = useState<Step>("form");
//   const [form, setForm] = useState(initialForm);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [resendTimer, setResendTimer] = useState(0);
//   const [resendTimerForgot, setResendTimerForgot] = useState(0);
//   const [showSigninPassword, setShowSigninPassword] = useState(false);
//   const [showSignupPassword, setShowSignupPassword] = useState(false);
//   const [showSignupConfirm, setShowSignupConfirm] = useState(false);

//   const {
//     loginWithPassword,
//     registerCustomer,
//     verifyEmailOtp,
//     sendForgotPasswordOtp,
//     verifyForgotPasswordOtp,
//     resetPassword,
//   } = useAuth();

//   useEffect(() => {
//     if (!isOpen) {
//       setTimeout(() => {
//         setTab("signin");
//         setStep("form");
//         setForm(initialForm);
//         setError("");
//         setResendTimer(0);
//         setResendTimerForgot(0);
//       }, 200);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     if (resendTimer <= 0) return;
//     const t = window.setInterval(() => setResendTimer((prev) => Math.max(prev - 1, 0)), 1000);
//     return () => window.clearInterval(t);
//   }, [resendTimer]);

//   useEffect(() => {
//     if (resendTimerForgot <= 0) return;
//     const t = window.setInterval(
//       () => setResendTimerForgot((prev) => Math.max(prev - 1, 0)),
//       1000
//     );
//     return () => window.clearInterval(t);
//   }, [resendTimerForgot]);

//   const setField = (key: keyof typeof form, value: string) => {
//     setError("");
//     setForm((prev) => ({ ...prev, [key]: value }));
//   };

//   const disableSubmit = useMemo(() => {
//     if (isLoading) return true;
//     if (tab === "signin") {
//       if (step === "verify-forgot") return !form.email || !form.otp;
//       if (step === "reset-password") return !form.newPassword || form.newPassword !== form.confirmNewPassword;
//       return !form.email || !form.password;
//     }
//     if (tab === "signup") {
//       return !form.fullName || !form.email || !form.password || form.password !== form.confirmPassword;
//     }
//     return false;
//   }, [form, isLoading, step, tab]);

//   const handleSignIn = async (e: FormEvent) => {
//     e.preventDefault();
//     if (disableSubmit) return;
//     setIsLoading(true);
//     const res = await loginWithPassword(form.email.trim(), form.password);
//     setIsLoading(false);
//     if (res.success) {
//       toast.success(res.message || "Signed in");
//       onClose();
//       onLoginSuccess?.();
//     } else {
//       setError(res.message);
//       toast.error(res.message);
//     }
//   };

//   const handleSignUp = async (e: FormEvent) => {
//     e.preventDefault();
//     if (disableSubmit) return;
//     if (form.password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }
//     setIsLoading(true);
//     const res = await registerCustomer({
//       fullName: form.fullName.trim(),
//       email: form.email.trim(),
//       password: form.password,
//     });
//     setIsLoading(false);
//     if (res.success) {
//       toast.success(res.message || "OTP sent to verify your email");
//       setStep("verify-register");
//       setResendTimer(30);
//     } else {
//       setError(res.message);
//       toast.error(res.message);
//     }
//   };

//   const handleVerifyRegister = async (e: FormEvent) => {
//     e.preventDefault();
//     if (!form.email || !form.otp) return;
//     setIsLoading(true);
//     const res = await verifyEmailOtp(form.email.trim(), form.otp.trim());
//     setIsLoading(false);
//     if (res.success) {
//       toast.success("Email verified");
//       // Auto sign-in after verification
//       const loginRes = await loginWithPassword(form.email.trim(), form.password);
//       if (loginRes.success) {
//         onClose();
//         onLoginSuccess?.();
//       } else {
//         toast.error(loginRes.message);
//       }
//     } else {
//       setError(res.message);
//       toast.error(res.message);
//     }
//   };

//   const handleForgotSend = async (e?: FormEvent) => {
//     e?.preventDefault();
//     if (!form.email) return;
//     setIsLoading(true);
//     const res = await sendForgotPasswordOtp(form.email.trim());
//     setIsLoading(false);
//     if (res.success) {
//       toast.success(res.message || "OTP sent");
//       setStep("verify-forgot");
//       setResendTimerForgot(30);
//     } else {
//       setError(res.message);
//       toast.error(res.message);
//     }
//   };

//   const handleVerifyForgot = async (e: FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     const res = await verifyForgotPasswordOtp(form.email.trim(), form.otp.trim());
//     setIsLoading(false);
//     if (res.success) {
//       toast.success("OTP verified. Set a new password.");
//       setStep("reset-password");
//     } else {
//       setError(res.message);
//       toast.error(res.message);
//     }
//   };

//   const handleResetPassword = async (e: FormEvent) => {
//     e.preventDefault();
//     if (form.newPassword !== form.confirmNewPassword) {
//       setError("Passwords do not match.");
//       return;
//     }
//     if (form.newPassword.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }
//     setIsLoading(true);
//     const res = await resetPassword(form.email.trim(), form.otp.trim(), form.newPassword);
//     setIsLoading(false);
//     if (res.success) {
//       toast.success("Password updated. Please sign in.");
//       setTab("signin");
//       setStep("form");
//       setForm(initialForm);
//     } else {
//       setError(res.message);
//       toast.error(res.message);
//     }
//   };

//   const handleResend = () => {
//     if (tab === "signup" && resendTimer === 0) {
//       void registerCustomer({
//         fullName: form.fullName.trim() || "Customer",
//         email: form.email.trim(),
//         password: form.password,
//       });
//       setResendTimer(30);
//       toast.info("Resent verification OTP");
//     }
//     if (tab === "signin" && step === "verify-forgot" && resendTimerForgot === 0) {
//       void sendForgotPasswordOtp(form.email.trim());
//       setResendTimerForgot(30);
//       toast.info("Resent reset OTP");
//     }
//   };

//   if (!isOpen) return null;

//   const renderTabContent = () => {
//     if (tab === "signin") {
//       if (step === "verify-forgot") {
//         return (
//           <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
//             <form onSubmit={handleVerifyForgot} className="space-y-4">
//               <div className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs text-gray-600 ring-1 ring-gray-100">
//                 <ShieldCheck className="h-4 w-4 text-green-600" />
//                 Enter the OTP sent to {form.email}
//               </div>
//               <input
//                 type="text"
//                 placeholder="Enter OTP"
//                 value={form.otp}
//                 onChange={(e) => setField("otp", e.target.value)}
//                 maxLength={6}
//                 className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-center tracking-[0.5em] text-sm focus:border-gray-900 focus:outline-none"
//               />
//               <button
//                 type="submit"
//                 disabled={isLoading || !form.otp}
//                 className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
//               >
//                 {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify OTP"}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleResend}
//                 disabled={resendTimerForgot > 0}
//                 className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-black disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
//               >
//                 <RefreshCw className="h-3.5 w-3.5" />
//                 {resendTimerForgot > 0 ? `Resend in ${resendTimerForgot}s` : "Resend OTP"}
//               </button>
//             </form>
//           </div>
//         );
//       }

//       if (step === "reset-password") {
//         return (
//           <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
//             <form onSubmit={handleResetPassword} className="space-y-4">
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                   type="password"
//                   placeholder="New password"
//                   value={form.newPassword}
//                   onChange={(e) => setField("newPassword", e.target.value)}
//                   required
//                   className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-3 text-sm focus:border-gray-900 focus:bg-white focus:outline-none"
//                 />
//               </div>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                   type="password"
//                   placeholder="Confirm password"
//                   value={form.confirmNewPassword}
//                   onChange={(e) => setField("confirmNewPassword", e.target.value)}
//                   required
//                   className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-3 text-sm focus:border-gray-900 focus:bg-white focus:outline-none"
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={disableSubmit}
//                 className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
//               >
//                 {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
//               </button>
//             </form>
//           </div>
//         );
//       }

//       return (
//         <form onSubmit={handleSignIn} className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-5">
//           <div className="relative">
//             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type="email"
//               placeholder="Email"
//               value={form.email}
//               onChange={(e) => setField("email", e.target.value)}
//               required
//               className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-3 text-sm focus:border-gray-900 focus:bg-white focus:outline-none"
//             />
//           </div>

//           <div className="relative">
//             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//             <input
//               type={showSigninPassword ? "text" : "password"}
//               placeholder="Password"
//               value={form.password}
//               onChange={(e) => setField("password", e.target.value)}
//               required
//               className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 py-3 text-sm focus:border-gray-900 focus:bg-white focus:outline-none"
//             />
//             <button
//               type="button"
//               onClick={() => setShowSigninPassword((prev) => !prev)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               aria-label={showSigninPassword ? "Hide password" : "Show password"}
//             >
//               {showSigninPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>

//           <div className="flex items-center justify-end text-xs text-gray-600">
//             <button
//               type="button"
//               onClick={() => {
//                 if (!form.email) {
//                   setError("Enter your email to reset password.");
//                   return;
//                 }
//                 void handleForgotSend();
//               }}
//               className="font-semibold text-gray-700 hover:text-black"
//             >
//               Forgot password?
//             </button>
//           </div>

//           <button
//             type="submit"
//             disabled={disableSubmit}
//             className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
//           >
//             {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Continue"}
//           </button>
//         </form>
//       );
//     }

//     // Sign up flows
//     if (step === "verify-register") {
//       return (
//         <form onSubmit={handleVerifyRegister} className="space-y-4">
//           <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
//             <ShieldCheck className="h-4 w-4 text-green-600" />
//             Check your email for the 6-digit OTP.
//           </div>
//           <input
//             type="text"
//             placeholder="Enter OTP"
//             value={form.otp}
//             onChange={(e) => setField("otp", e.target.value)}
//             maxLength={6}
//             className="w-full rounded-lg border border-gray-200 bg-white px-3 py-3 text-center tracking-[0.5em] text-sm focus:border-gray-900 focus:outline-none"
//           />
//           <button
//             type="submit"
//             disabled={isLoading || !form.otp}
//             className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
//           >
//             {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify & Continue"}
//           </button>
//           <button
//             type="button"
//             onClick={handleResend}
//             disabled={resendTimer > 0}
//             className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:border-black disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400"
//           >
//             <RefreshCw className="h-3.5 w-3.5" />
//             {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
//           </button>
//         </form>
//       );
//     }

//     return (
//       <form onSubmit={handleSignUp} className="space-y-4 rounded-xl border border-gray-100 bg-gray-50 p-5">
//         <div className="relative">
//           <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder="Full name"
//             value={form.fullName}
//             onChange={(e) => setField("fullName", e.target.value)}
//             required
//             className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-3 text-sm focus:border-gray-900 focus:bg-white focus:outline-none"
//           />
//         </div>
//         <div className="relative">
//           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//           <input
//             type="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) => setField("email", e.target.value)}
//             required
//             className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-3 text-sm focus:border-gray-900 focus:bg-white focus:outline-none"
//           />
//         </div>
//         <div className="relative">
//           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//           <input
//             type={showSignupPassword ? "text" : "password"}
//             placeholder="Password (min 6 characters)"
//             value={form.password}
//             onChange={(e) => setField("password", e.target.value)}
//             required
//             className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 py-3 text-sm focus:border-gray-900 focus:bg-white focus:outline-none"
//           />
//           <button
//             type="button"
//             onClick={() => setShowSignupPassword((prev) => !prev)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//             aria-label={showSignupPassword ? "Hide password" : "Show password"}
//           >
//             {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>
//         <div className="relative">
//           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
//           <input
//             type={showSignupConfirm ? "text" : "password"}
//             placeholder="Confirm password"
//             value={form.confirmPassword}
//             onChange={(e) => setField("confirmPassword", e.target.value)}
//             required
//             className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-10 py-3 text-sm focus:border-gray-900 focus:bg-white focus:outline-none"
//           />
//           <button
//             type="button"
//             onClick={() => setShowSignupConfirm((prev) => !prev)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
//             aria-label={showSignupConfirm ? "Hide password" : "Show password"}
//           >
//             {showSignupConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>
//         <button
//           type="submit"
//           disabled={disableSubmit}
//           className="flex w-full items-center justify-center rounded-lg bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
//         >
//           {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create account"}
//         </button>
//       </form>
//     );
//   };

//   return (
//     <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//       <div className="relative w-full max-w-lg">
//         <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-100">
//           <div className="flex flex-col items-center gap-4 border-b border-gray-100 px-6 py-6">
//             <img src="/navbar_logo1.svg" alt="Aesthco" className="h-12 w-auto" />
//             <div className="text-center">
//               <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
//                 Welcome back
//               </p>
//               <h2 className="text-xl font-bold text-gray-900">Access your account</h2>
//             </div>
//             <button
//               onClick={onClose}
//               className="absolute right-4 top-4 text-gray-400 transition hover:text-black"
//             >
//               <X size={20} />
//             </button>
//           </div>

//           <div className="px-6 pt-4">
//             <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-1">
//               {(["signin", "signup"] as Tab[]).map((t) => (
//                 <button
//                   key={t}
//                   onClick={() => {
//                     setTab(t);
//                     setStep("form");
//                     setError("");
//                     setForm(initialForm);
//                   }}
//                   className={`rounded-md py-2 text-sm font-semibold transition ${
//                     tab === t ? "bg-white shadow-sm ring-1 ring-gray-200 text-gray-900" : "text-gray-500"
//                   }`}
//                 >
//                   {t === "signin" ? "Sign In" : "Sign Up"}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="px-6 pb-6 pt-4">
//             {error && (
//               <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//                 {error}
//               </div>
//             )}
//             {renderTabContent()}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthModal;
