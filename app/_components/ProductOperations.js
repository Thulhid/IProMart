"use client";

import Filter from "@/app/_components/Filter";
import SortBy from "@/app/_components/SortBy";

function ProductOperations() {
  const searchParamsToReset = [{ name: "page", value: 1 }];
  return (
    <div className="flex sm:flex-row flex-col mb-5 ml-auto w-fit items-center gap-1 sm:mb-8 sm:gap-2 ">
      <Filter
        filterField="used"
        options={[
          { value: "all", label: "All" },
          { value: "brand-new", label: "Brand New" },
          { value: "used", label: "Used" },
        ]}
        searchParamsToReset={searchParamsToReset}
      />
      <SortBy
        options={[
          { value: "newest", label: "Sort by newest" },
          { value: "name-asc", label: "Sort by name (A-Z)" },
          { value: "name-desc", label: "Sort by name (Z-A)" },
          { value: "finalPrice-asc", label: "Sort by price (low first)" },
          { value: "finalPrice-desc", label: "Sort by price (high first)" },
        ]}
      />
    </div>
  );
}

export default ProductOperations;
