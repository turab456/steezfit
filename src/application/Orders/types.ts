export type OrderItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
};

export type OrderAddress = {
  recipient: string;
  street: string;
  city: string;
  pin: string;
  type?: string;
  phone?: string;
  email?: string;
};

export type PaymentInfo = {
  method: string;
  last4?: string;
  expires?: string;
};

export type Order = {
  id: string;
  number: string;
  datePlaced: string;
  deliveryDate?: string;
  status: "Processing" | "Packed" | "Shipped" | "Delivered" | "Order placed";
  total: number;
  items: OrderItem[];
  address: OrderAddress;
  payment: PaymentInfo;
};
