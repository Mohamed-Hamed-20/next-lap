"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Order } from "@/types/order";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  image?: string;
}

interface ProfileClientProps {
  user: User;
  orders: Order[];
}

async function fetchUserData(initialUser: User): Promise<User> {
  return initialUser;
}

async function updateUserData(updatedUser: User): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return updatedUser;
}

export default function ProfileClient({ user: initialUser, orders }: ProfileClientProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(initialUser);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUserData(initialUser),
    initialData: initialUser,
  });

  const mutation = useMutation({
    mutationFn: updateUserData,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user"], updatedUser);
      setIsEditing(false);
      alert("Profile updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-1">Phone</label>
              <input
                type="text"
                id="phone"
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label htmlFor="address" className="block mb-1">Address</label>
              <input
                type="text"
                id="address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="border p-2 rounded w-full"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="bg-[#9e6b2a] text-white px-4 py-2 rounded hover:bg-[#9e6c2ab4]"
              >
                {mutation.isPending ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={user.image || "/default-avatar.jpg"}
                alt={user.name}
                className="w-full h-full object-cover"
                width={500}
                height={500}
              />
            </div>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Phone:</strong> {user.phone || "Not provided"}
              </p>
              <p>
                <strong>Address:</strong> {user.address || "Not provided"}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#9e6b2a] text-white px-4 py-2 rounded hover:bg-[#9e6c2ab4] mt-2"
              >
                Edit Profile
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2 ml-2"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Order History</h2>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border p-4 rounded-lg">
                <p>
                  <strong>Order ID:</strong> {order.id}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total:</strong> ${order.total.toFixed(2)}
                </p>
                <div className="mt-2">
                  <strong>Products:</strong>
                  <ul className="list-disc pl-5">
                    {order.products.map((product) => (
                      <li key={product.productId}>
                        {product.title} - Quantity: {product.quantity} - Price: ${product.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No orders found.</p>
        )}
      </section>
    </div>
  );
}