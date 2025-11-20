import type { Order } from "../types";

const orders: Order[] = [
  {
    id: "54879",
    number: "WU88191111",
    datePlaced: "2021-03-22",
    deliveryDate: "2021-03-24",
    status: "Processing",
    total: 160,
    address: {
      recipient: "Floyd Miles",
      street: "7363 Cynthia Pass",
      city: "Toronto, ON N3Y 4H8",
      pin: "N3Y 4H8",
      email: "f***@example.com",
      phone: "1********40",
    },
    payment: {
      method: "Visa",
      last4: "4242",
      expires: "02 / 24",
    },
    items: [
      {
        id: "item-1",
        name: "Nomad Tumbler",
        description:
          "This durable and portable insulated tumbler will keep your beverage at the perfect temperature.",
        image:
          "https://tailwindui.com/img/ecommerce-images/order-history-page-07-product-01.jpg",
        price: 35,
        quantity: 1,
      },
      {
        id: "item-2",
        name: "Minimalist Wristwatch",
        description:
          "This contemporary wristwatch has a clean, minimalist look and high quality components.",
        image:
          "https://tailwindui.com/img/ecommerce-images/order-history-page-07-product-02.jpg",
        price: 149,
        quantity: 1,
      },
    ],
  },
  {
    id: "54880",
    number: "WU99112233",
    datePlaced: "2021-07-06",
    deliveryDate: "2021-07-12",
    status: "Delivered",
    total: 160,
    address: {
      recipient: "Courtney Henry",
      street: "123 Harper Street",
      city: "New York, NY",
      pin: "10001",
      email: "c***@example.com",
      phone: "1********21",
    },
    payment: {
      method: "Mastercard",
      last4: "4444",
      expires: "05 / 24",
    },
    items: [
      {
        id: "item-3",
        name: "Micro Backpack",
        description:
          "Compact carry option for everyday essentials. Wear it like a backpack or satchel.",
        image:
          "https://tailwindui.com/img/ecommerce-images/order-history-page-06-product-01.jpg",
        price: 70,
        quantity: 1,
      },
      {
        id: "item-4",
        name: "Nomad Shopping Tote",
        description:
          "Durable shopping tote with water and tear-resistant yellow canvas construction.",
        image:
          "https://tailwindui.com/img/ecommerce-images/order-history-page-06-product-02.jpg",
        price: 90,
        quantity: 1,
      },
    ],
  },
];

export const OrderApi = {
  list(): Promise<Order[]> {
    return Promise.resolve(orders);
  },
  getById(orderId: string): Promise<Order | undefined> {
    return Promise.resolve(orders.find((o) => o.id === orderId));
  },
};

export default OrderApi;
