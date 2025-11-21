export type AddressType = 'home' | 'work' | 'other';

export type Address = {
  id: string;
  name: string;
  phoneNumber?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode?: string | null;
  addressType: AddressType;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AddressPayload = {
  name?: string;
  phoneNumber?: string;
  addressLine1: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  addressType?: AddressType;
  isDefault?: boolean;
};
