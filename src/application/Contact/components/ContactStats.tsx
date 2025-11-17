import React from "react";
import { Truck, RotateCcw, Headphones, Lock } from "lucide-react";

const ContactStatsBar: React.FC = () => {
  const items = [
    {
      icon: <Truck className="h-5 w-5" />,
      title: "Free Shipping",
      subtitle: "Orders above $200",
    },
    {
      icon: <RotateCcw className="h-5 w-5" />,
      title: "Money-back",
      subtitle: "30 day Guarantee",
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      title: "Premium Support",
      subtitle: "Phone and email support",
    },
    {
      icon: <Lock className="h-5 w-5" />,
      title: "Secure Payments",
      subtitle: "Secured by Stripe",
    },
  ];

  return (
    <section className="w-full pb-14 pt-4">
      <div className="max-w-7xl mx-auto px-4 md:px-6 border-t border-[#e2d7cd] pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left"
            >
              <div className="text-[#1f1f1f] mb-1 sm:mb-0 sm:mt-0.5">{item.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#222222]">
                  {item.title}
                </p>
                <p className="text-xs text-[#777777] mt-1">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactStatsBar;
