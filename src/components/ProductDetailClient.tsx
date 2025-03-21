"use client";

import { Product } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { addToCart } from "@/app/actions/cart";
import Image from "next/image";

const fetchProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`https://e-commerce-api-tau-five.vercel.app/product/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }
  const responseData = await response.json();

  if (!responseData || typeof responseData !== "object" || !responseData.data) {
    throw new Error("Unexpected product data format");
  }

  const productData = responseData.data;

  if (!Array.isArray(productData.images)) {
    productData.images = [];
  }

  return productData;
};

interface ProductDetailClientProps {
  initialProduct: Product;
}

export default function ProductDetailClient({ initialProduct }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);

  const { data: product, error, isLoading } = useQuery<Product, Error>({
    queryKey: ["product", initialProduct.id],
    queryFn: () => fetchProduct(initialProduct.id),
    initialData: initialProduct,
    staleTime: 5 * 60 * 1000,
  });

  const handleAddToCart = async () => {
    if (!product) return;
    if (product.stock < quantity) {
      alert(`Sorry, only ${product.stock} items are available in stock.`);
      return;
    }
    const productWithQuantity = { ...product, quantity };
    const result = await addToCart(productWithQuantity);
    if (result.success) {
      alert(result.message);
    } else {
      alert("Failed to add to cart.");
    }
  };

  if (isLoading) {
    return <div>Loading product details...</div>;
  }

  if (error) {
    return <div>Error loading product: {error.message}</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <Image
          src={
            Array.isArray(product.images) && product.images.length > 0
              ? product.images[0].secure_url
              : "/default-image.jpg"
          }
          alt={product.title || "Product"}
          className="w-full h-96 object-cover rounded-lg"
          width={500} height={500}
        />
      </div>

      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">{product.title || "Untitled Product"}</h2>
        <p className="text-gray-600 mb-2">
          Category: {product.category?.name || "N/A"}
        </p>
        <p className="text-gray-600 mb-2">
          Brand: {product.brand?.name || "N/A"}
        </p>
        <p className="text-gray-600 mb-4">{product.description || "No description available."}</p>
        <p className="text-lg font-semibold mb-2">
          Price: ${product.finalPrice !== undefined ? product.finalPrice : "N/A"}
        </p>
        <p className="text-gray-600 mb-4">
          In Stock: {product.stock !== undefined ? product.stock : "N/A"}
        </p>

        <div className="mb-4">
          <label htmlFor="quantity" className="mr-2">Quantity:</label>
          <input
            type="number"
            id="quantity"
            min="1"
            max={product.stock !== undefined ? product.stock : Infinity}
            value={quantity}
            onChange={(e) => {
              const newQuantity = Math.max(
                1,
                Math.min(
                  product.stock !== undefined ? product.stock : Infinity,
                  parseInt(e.target.value)
                )
              );
              setQuantity(newQuantity);
            }}
            className="border p-2 rounded w-20"
            disabled={product.stock === 0 || product.stock === undefined}
          />
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || product.stock === undefined}
          className={`px-6 py-3 rounded transition-all duration-300 ${
            product.stock === 0 || product.stock === undefined
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#9e6b2a] text-white hover:bg-[#9e6c2ab4]"
          }`}
        >
          {product.stock === 0 || product.stock === undefined ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}