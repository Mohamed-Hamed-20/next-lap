"use client";

import { Category } from "@/types/category";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface FilterSortClientProps {
  categories: Category[];
}

export default function FilterSortClient({
  categories,
}: FilterSortClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      router.push(`/product?${params.toString()}`);
    },
    [router, searchParams]
  );

  const resetFilters = () => {
    router.push("/product");
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white shadow-md rounded-lg">
      {/* Category Filter */}
      <div className="flex flex-col">
        <label htmlFor="category" className="font-medium mb-1">
          Category:
        </label>
        <select
          id="category"
          name="category"
          defaultValue={searchParams.get("category") || ""}
          onChange={(e) => updateSearchParams("category", e.target.value)}
          className="border p-2 rounded cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Min Price Filter */}
      <div className="flex flex-col">
        <label htmlFor="minPrice" className="font-medium mb-1">
          Min Price:
        </label>
        <input
          type="number"
          id="minPrice"
          name="minPrice"
          defaultValue={searchParams.get("minPrice") || ""}
          onChange={(e) => updateSearchParams("minPrice", e.target.value)}
          className="border p-2 rounded w-32"
        />
      </div>

      {/* Max Price Filter */}
      <div className="flex flex-col">
        <label htmlFor="maxPrice" className="font-medium mb-1">
          Max Price:
        </label>
        <input
          type="number"
          id="maxPrice"
          name="maxPrice"
          defaultValue={searchParams.get("maxPrice") || ""}
          onChange={(e) => updateSearchParams("maxPrice", e.target.value)}
          className="border p-2 rounded w-32"
        />
      </div>

      {/* Sort Options */}
      <div className="flex flex-col">
        <label htmlFor="sort" className="font-medium mb-1">
          Sort By:
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={searchParams.get("sort") || ""}
          onChange={(e) => updateSearchParams("sort", e.target.value)}
          className="border p-2 rounded cursor-pointer"
        >
          <option value="">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="bg-red-500 text-white px-4 py-2 rounded self-end mt-4 md:mt-0 hover:bg-red-600 transition"
      >
        Reset Filters
      </button>
    </div>
  );
}
