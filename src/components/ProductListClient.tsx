"use client";

import { Product } from "@/types/products";
import { Category } from "@/types/category";
import { useSearchParams } from "next/navigation";
import ProductCardClient from "./ProductCardClient";
import FilterSortClient from "./FilterSortClient";
import { useState, useEffect } from "react";

interface ProductListClientProps {
  products: Product[];
  categories: Category[];
}

export default function ProductListClient({
  products,
  categories,
}: ProductListClientProps) {
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  useEffect(() => {
    let updatedProducts = [...products];

    const category = searchParams.get("category");
    if (category) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category.name === category
      );
    }

    const minPrice = searchParams.get("minPrice")
      ? parseFloat(searchParams.get("minPrice")!)
      : 0;
    const maxPrice = searchParams.get("maxPrice")
      ? parseFloat(searchParams.get("maxPrice")!)
      : Infinity;
    updatedProducts = updatedProducts.filter(
      (product) =>
        product.finalPrice >= minPrice && product.finalPrice <= maxPrice
    );

    const sort = searchParams.get("sort");
    if (sort) {
      if (sort === "price-asc") {
        updatedProducts.sort((a, b) => a.finalPrice - b.finalPrice);
      } else if (sort === "price-desc") {
        updatedProducts.sort((a, b) => b.finalPrice - a.finalPrice);
      } else if (sort === "name-asc") {
        updatedProducts.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sort === "name-desc") {
        updatedProducts.sort((a, b) => b.title.localeCompare(a.title));
      }
    }

    setFilteredProducts(updatedProducts);
  }, [searchParams, products]);

  return (
    <>
      <section className="mb-8">
        <FilterSortClient categories={categories} />
      </section>

      <section>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCardClient key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </section>
    </>
  );
}
