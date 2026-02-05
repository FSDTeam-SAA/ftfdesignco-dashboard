"use client";

import { useAnalytics } from "../hooks/useAnalytics";
import { Users, Package, ShoppingCart, Landmark } from "lucide-react";
import RecentOrders from "./RecentOrders";

export default function Dashboard() {
  const { data, isLoading, error } = useAnalytics();

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-500">Error: {error.message}</div>;

  const analytics = data?.data;

  const cards = [
    {
      title: "Orders",
      value: analytics?.totalOrders || 0,
      icon: <ShoppingCart size={36} />,
      color: "text-green-700",
      bg: "bg-green-50",
    },
    {
      title: "Branches",
      value: 8,
      icon: <Landmark size={36} />,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Products",
      value: analytics?.totalProducts || 0,
      icon: <Package size={36} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Users",
      value: analytics?.totalUsers || 0,
      icon: <Users size={36} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="p-6">
      <div className="border rounded-xl p-5 bg-white mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Enquiries by Product Type
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`${card.bg} p-4 rounded-lg flex justify-between items-center`}
            >
              <div>
                <p className="text-md font-semibold text-gray-600">
                  {card.title}
                </p>
                <p className={`text-4xl font-bold mt-1 ${card.color}`}>
                  {card.value}
                </p>
              </div>

              <div className="text-black">{card.icon}</div>
            </div>
          ))}
        </div>
      </div>

      <RecentOrders />
    </div>
  );
}
