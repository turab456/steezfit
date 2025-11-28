import { useEffect, useMemo, useState } from "react";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  CubeIcon,
  MapPinIcon,
  PlusIcon,
  PhoneIcon,
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

  // FIX 1: Removed [updateUser] from dependency array to stop infinite loop
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await ProfileApi.fetchProfile();
        setProfile(data);
        // Only update context if data actually changed to avoid extra renders
        if (JSON.stringify(data) !== JSON.stringify(user)) {
             updateUser(data);
        }
      } catch (error: any) {
        console.error("Profile load failed:", error);
        // Optional: toast.error(error?.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // FIX 2: Removed [updateUser] here as well
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
  }, []);

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
      // Optimistic update locally to avoid full refetch delay
      const updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
      setAddresses(updatedAddresses);
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
      <section className="min-h-screen bg-gray-50 py-10  md:py-32 sm:py-24 lg:py-32">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:px-8">
          
          
         

          {/* Main Grid Layout - Adjusted since Security card is removed */}
          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Left Column: Profile Details (Takes 1 part width) */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Profile Details
                  </h2>
                </div>
                
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
                      Full name
                    </dt>
                    <dd className="text-base font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {profile?.fullName || "Not set"}
                    </dd>
                  </div>
                  
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wider text-gray-500 mb-1">
                      Email address
                    </dt>
                    <dd className="flex items-center gap-2 text-base font-medium text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                      {profile?.email || "Not set"}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Link
                    to="/orders"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    <CubeIcon className="h-5 w-5" />
                    View My Orders
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Addresses (Takes 2 parts width) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Saved Addresses
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your delivery locations</p>
                  </div>
                  <button
                    onClick={() => setIsAddressModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50 hover:border-gray-300"
                  >
                    <PlusIcon className="h-4 w-4" />
                    Add New
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                  {addresses.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-12 text-center">
                      <MapPinIcon className="h-10 w-10 text-gray-300 mb-3" />
                      <p className="font-semibold text-gray-900">No addresses saved yet</p>
                      <p className="text-sm text-gray-500 mt-1 max-w-xs">
                        Add a delivery address to speed up your checkout process.
                      </p>
                    </div>
                  )}
                  
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`relative flex flex-col justify-between rounded-xl border p-4 transition ${
                        address.isDefault 
                          ? "border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/10" 
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                           <div className="flex items-center gap-2">
                             <span className="font-semibold text-gray-900">{address.name}</span>
                             <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                               {address.addressType}
                             </span>
                           </div>
                           {address.isDefault && (
                             <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                               <CheckCircleIcon className="w-3 h-3" /> Default
                             </span>
                           )}
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-0.5 mb-4">
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>
                            {address.city}, {address.state} - <span className="text-gray-900 font-medium">{address.postalCode}</span>
                          </p>
                          {address.phoneNumber && (
                             <p className="flex items-center gap-1.5 pt-1 text-gray-500">
                               <PhoneIcon className="h-3 w-3" /> {address.phoneNumber}
                             </p>
                          )}
                        </div>
                      </div>

                      {!address.isDefault && (
                        <div className="pt-3 border-t border-gray-100">
                           <button
                            onClick={() => handleSetDefault(address.id)}
                            className="text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
                          >
                            Set as default
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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