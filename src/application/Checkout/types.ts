//address types

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

export type CouponValidation = {
  code: string;
  discountAmount: number;
  type?: string;
  message?: string;
};

export type AvailableCoupon = {
  id: number;
  code: string;
  type?: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscountAmount?: number | null;
  globalMaxRedemptions?: number | null;
  perUserLimit?: number | null;
  startAt?: string | null;
  endAt?: string | null;
  isActive?: boolean;
  redemptionsCount?: number;
};
