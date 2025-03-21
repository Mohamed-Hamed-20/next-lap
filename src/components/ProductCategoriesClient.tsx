"use client";

import { Product } from "@/types/products";
import { Category } from "@/types/category";
import Image from "next/image";

interface ProductCategoriesClientProps {
  categories: Category[];
  products: Product[];
}

export default function ProductCategoriesClient({ categories, products }: ProductCategoriesClientProps) {
  return (
    <div>
      {categories.map((category) => (
        <div key={category.id} className="mb-8">
          <u className="text-xl font-semibold mb-4">{category.name}</u>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products
              .filter((product) => product.category.name === category.name)
              .map((product) => (
                <div key={product.id} className="border p-4 rounded-lg shadow-md">
                  <Image
                    src={product.images[0]?.secure_url || "/default-image.jpg"}
                    alt={product.title}
                    className="w-full h-48 object-cover mb-4"
                    width={300} height={300}
                  />
                  <h4 className="text-lg font-semibold">{product.title}</h4>
                  <p className="text-gray-600">{product.finalPrice}$</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}