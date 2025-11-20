import { useEffect, useMemo, useState } from "react";
import { ShieldCheckIcon, UserCircleIcon, EnvelopeIcon, CheckCircleIcon, LockClosedIcon, CubeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ProfileApi } from "./api/ProfileApi";
import type { UserProfile } from "./types";
import { useAuth } from "../../contexts/AuthContext";

type ChangePasswordState = {
  otp: string;
  newPassword: string;
};

const passwordHint =
  "Use at least 8 characters with uppercase, number, and special character.";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(
    user ? { 
      ...user, 
      fullName: user.fullName || '',
      email: user.email || '',
      role: user.role || 'customer'
    } : null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changePassword, setChangePassword] = useState<ChangePasswordState>({
    otp: "",
    newPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const fullName = useMemo(() => profile?.fullName ?? "Guest", [profile]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await ProfileApi.fetchProfile();
        setProfile(data);
        updateUser(data);
      } catch (error: any) {
        console.error("Profile load failed:", error);
        toast.error(error?.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [updateUser]);

  const validatePassword = (value: string) => {
    if (value.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(value)) return "Add at least one uppercase letter.";
    if (!/[0-9]/.test(value)) return "Add at least one number.";
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(value))
      return "Add at least one special character.";
    return "";
  };

  const handleChangePassword = async () => {
    const pwdError = validatePassword(changePassword.newPassword);
    setPasswordError(pwdError);
    if (pwdError) return;

    if (!profile?.email) {
      toast.error("Missing email for password change.");
      return;
    }

    setSubmitting(true);
    try {
      const resp: any = await ProfileApi.changePassword(
        profile.email,
        changePassword.otp,
        changePassword.newPassword
      );
      if (resp?.success) {
        toast.success(resp.message || "Password updated.");
        setIsModalOpen(false);
        setChangePassword({ otp: "", newPassword: "" });
      } else {
        toast.error(resp?.message || "Password change failed.");
      }
    } catch (error: any) {
      toast.error(error?.message || "Password change failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-50 py-12">
        <div className="mx-auto max-w-4xl px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-48 rounded-lg bg-gray-200" />
            <div className="h-32 rounded-2xl bg-gray-200" />
            <div className="h-48 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
            My Account
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold text-gray-900">{fullName}</h1>
            {profile?.isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <CheckCircleIcon className="h-4 w-4" />
                Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <ShieldCheckIcon className="h-4 w-4" />
                Pending verification
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Manage your profile, orders, and security from one place.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_minmax(320px,1fr)]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center gap-3">
                <UserCircleIcon className="h-8 w-8 text-gray-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Account
                  </p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Profile details
                  </h2>
                </div>
              </div>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <dt className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Full name
                  </dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {profile?.fullName || "—"}
                  </dd>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <dt className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Email
                  </dt>
                  <dd className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                    {profile?.email || "—"}
                  </dd>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <dt className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Role
                  </dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {profile?.role || "customer"}
                  </dd>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <dt className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Last login
                  </dt>
                  <dd className="text-sm font-semibold text-gray-900">
                    {profile?.lastLogin
                      ? new Date(profile.lastLogin).toLocaleString()
                      : "—"}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  to="/orders/123"
                  className="inline-flex items-center gap-2 rounded-full border border-gray-900 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
                >
                  <CubeIcon className="h-4 w-4" />
                  View orders
                </Link>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  <LockClosedIcon className="h-4 w-4" />
                  Change password
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Orders
                  </p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent orders
                  </h2>
                </div>
                <Link
                  to="/orders/123"
                  className="text-sm font-semibold text-gray-700 hover:text-indigo-600"
                >
                  View all →
                </Link>
              </div>
              <div className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">No orders yet</p>
                <p className="text-gray-600">
                  When you place an order, it will appear here with delivery
                  updates.
                </p>
                <div className="mt-3 flex gap-2">
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-gray-800"
                  >
                    Start Shopping
                  </Link>
                  <Link
                    to="/orders/123"
                    className="inline-flex items-center justify-center rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-gray-800 transition hover:border-gray-900 hover:text-gray-900"
                  >
                    Track Orders
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="h-6 w-6 text-gray-500" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Security
                  </p>
                  <h3 className="text-base font-semibold text-gray-900">
                    Keep your account safe
                  </h3>
                </div>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>Use strong passwords and never reuse them.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>Verify your email to secure account recovery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="mt-0.5 h-4 w-4 text-emerald-600" />
                  <span>Review orders regularly to spot unusual activity.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                  Security
                </p>
                <h3 className="text-lg font-semibold text-gray-900">
                  Change password
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-600">
                  Email
                </label>
                <div className="mt-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                  {profile?.email || "—"}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-600">
                  OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={changePassword.otp}
                  onChange={(e) =>
                    setChangePassword((prev) => ({
                      ...prev,
                      otp: e.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-600">
                  New password
                </label>
                <input
                  type="password"
                  value={changePassword.newPassword}
                  onChange={(e) => {
                    setChangePassword((prev) => ({
                      ...prev,
                      newPassword: e.target.value,
                    }));
                    if (passwordError) {
                      setPasswordError("");
                    }
                  }}
                  className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none ${
                    passwordError
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-200 focus:border-gray-900"
                  }`}
                  placeholder="New password"
                />
                <p className={`mt-1 text-xs ${passwordError ? "text-red-500" : "text-gray-500"}`}>
                  {passwordError || passwordHint}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={submitting}
                  className="flex-1 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60"
                >
                  {submitting ? "Updating..." : "Update password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
