import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheckIcon,
  UserCircleIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  CubeIcon,
  MapPinIcon,
  PlusIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { ProfileApi } from "./api/ProfileApi";
import type { UserProfile, UserAddress } from "./types";
import { useAuth } from "../../contexts/AuthContext";
import AddAddressModal from "../Checkout/components/AddAddressModal";
import type { AddressFormState } from "../Checkout/components/AddAddressModal";
import AddressService from "../Checkout/api/AddressApi";

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(
    user
      ? {
          ...user,
          fullName: user.fullName || "",
          email: user.email || "",
          role: user.role || "customer",
        }
      : null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressFormState>({
    name: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "",
    addressType: "home",
    isDefault: false,
  });

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

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const data = await ProfileApi.fetchAddresses();
        setAddresses(data || []);
      } catch (error: any) {
        console.error("Address load failed:", error);
      }
    };
    loadAddresses();
  }, [updateUser]);

  const handleAddressChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    const checked = 'checked' in event.target ? event.target.checked : false;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!addressForm.name || !addressForm.addressLine1 || !addressForm.city) {
      toast.error("Please fill required fields.");
      return;
    }
    try {
      const created = await AddressService.create(addressForm);
      toast.success("Address added.");
      setAddresses((prev) => [created, ...prev]);
      setIsAddressModalOpen(false);
      setAddressForm({
        name: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "",
        addressType: "home",
        isDefault: false,
      });
    } catch (error: any) {
      console.error("Add address failed:", error);
      toast.error(error?.message || "Failed to add address (Bengaluru only).");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await AddressService.setDefault(id);
      const refreshed = await ProfileApi.fetchAddresses();
      setAddresses(refreshed || []);
      toast.success("Default address updated.");
    } catch (error: any) {
      console.error("Set default address failed:", error);
      toast.error(error?.message || "Failed to set default address.");
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
    <>
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
              View your profile details and recent activity.
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
                      {profile?.fullName || "Not set"}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <dt className="text-xs uppercase tracking-[0.3em] text-gray-500">
                      Email
                    </dt>
                    <dd className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <EnvelopeIcon className="h-4 w-4 text-gray-500" />
                      {profile?.email || "Not set"}
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
                        : "Not available"}
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
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white/90 p-5 shadow-sm backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                      Addresses
                    </p>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Saved delivery addresses
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:border-gray-900"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add address
                  </button>
                </div>
                <div className="mt-4 grid gap-4">
                  {addresses.length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                      <p className="font-semibold text-gray-900">No addresses saved</p>
                      <p className="text-gray-600">
                        Add a delivery address (Bengaluru only) to speed up checkout.
                      </p>
                    </div>
                  )}
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <MapPinIcon className="h-5 w-5 text-gray-500" />
                          <p className="text-sm font-semibold text-gray-900">
                            {address.name}
                          </p>
                          {address.isDefault && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-700">
                              Default
                            </span>
                          )}
                        </div>
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefault(address.id)}
                            className="text-xs font-semibold text-gray-700 hover:text-gray-900"
                          >
                            Set default
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-700">
                        {address.addressLine1}
                      </p>
                      {address.addressLine2 && (
                        <p className="text-sm text-gray-700">{address.addressLine2}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                        <span className="rounded-full bg-gray-100 px-2 py-1 font-semibold uppercase tracking-[0.25em] text-gray-700">
                          {address.addressType}
                        </span>
                        {address.phoneNumber && (
                          <span className="flex items-center gap-1">
                            <SparklesIcon className="h-4 w-4 text-gray-500" />
                            {address.phoneNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
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
                    <span>Only sign in using the OTP sent to your email.</span>
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
      </section>
      <AddAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        formState={addressForm}
        onChange={handleAddressChange}
        onSubmit={handleAddressSubmit}
      />
    </>
  );
}

ProfilePage.DisplayName = "ProfilePage";
