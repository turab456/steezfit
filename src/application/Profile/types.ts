export type UserProfile = {
  id?: string;
  fullName: string;
  email: string;
  role?: string;
  isVerified?: boolean;
  lastLogin?: string | null;
};

export type UserAddress = {
  id: string;
  name: string;
  phoneNumber?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode?: string | null;
  addressType: 'home' | 'work' | 'other';
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
