"use client";

import { Product } from "@/types/products";
import { useState } from "react";
import { addToWishlist } from "@/app/actions/wishlist";
import Image from "next/image";
import Link from "next/link";

interface ProductCardClientProps {
  product: Product;
}

export default function ProductCardClient({ product }: ProductCardClientProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shortDescription = product.description.slice(0, 100);

  const handleAddToWishlist = async () => {
    const result = await addToWishlist(product);
    alert(result.message);
  };

  return (
    <div className="border p-4 rounded-lg shadow-md">
      <Image
        src={product.images[0]?.secure_url || "/default-image.jpg"}
        alt={product.title}
        className="w-full h-48 object-cover mb-4"
        width={300}
        height={300}
      />
      <h3 className="text-lg font-semibold">{product.title}</h3>
      <p className="text-gray-600">{product.finalPrice}$</p>
      <p className="text-gray-500 mt-2">
        {isExpanded ? product.description : `${shortDescription}...`}
        {product.description.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#9e6b2a] hover:underline ml-2"
          >
            {isExpanded ? "See Less" : "See More"}
          </button>
        )}
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleAddToWishlist}
          className="mt-4 bg-[#9e6b2a] text-white px-4 py-2 rounded hover:bg-[#9e6c2ab4] transition-all duration-300"
        >
          Add to Wishlist
        </button>
        <Link
          href={`/product/${product.id}`}
          className="mt-4 bg-[#9e6b2a] text-white px-4 py-2 rounded hover:bg-[#9e6c2ab4] transition-all duration-300"
        >
          View
        </Link>
      </div>
    </div>
  );
}
