"use client";

import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/products";
import Image from "next/image";

const fetchFeaturedProducts = async (): Promise<Product[]> => {
  const response = await fetch("https://e-commerce-api-tau-five.vercel.app/product");
  if (!response.ok) {
    throw new Error("Failed to fetch featured products");
  }
  const products: Product[] = await response.json();
  return products.filter((product) => product.isFeatured || false);
};

interface FeaturedProductsProps {
  initialProducts: Product[];
}

export default function FeaturedProducts({ initialProducts }: FeaturedProductsProps) {
  const { data: featuredProducts, error, isLoading } = useQuery<Product[], Error>({
    queryKey: ["featuredProducts"],
    queryFn: fetchFeaturedProducts,
    initialData: initialProducts,
  });

  if (isLoading) {
    return <div>Loading featured products...</div>;
  }

  if (error) {
    return <div>Error loading featured products: {error.message}</div>;
  }

  return (
    <div>
      {featuredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg shadow-md">
              <Image
                src={product.images[0]?.secure_url || "/default-image.jpg"}
                alt={product.title}
                className="w-full h-48 object-cover mb-4"
                width={300} height={300}
              />
              <h3 className="text-lg font-semibold">{product.title}</h3>
              <p className="text-gray-600">{product.finalPrice}$</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No featured products available.</p>
      )}
    </div>
  );
}