export type UserProfile = {
  id?: string;
  fullName: string;
  email: string;
  role?: string;
  isVerified?: boolean;
  lastLogin?: string | null;
};
