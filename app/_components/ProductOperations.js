"use client";

import Filter from "@/app/_components/Filter";
import SortBy from "@/app/_components/SortBy";

function ProductOperations() {
  const searchParamsToReset = [{ name: "page", value: 1 }];
  return (
    <div className="mb-5 ml-auto flex w-fit flex-col items-center gap-1 sm:mb-8 sm:flex-row sm:gap-2">
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
          { value: "-clicks", label: "Most clicked" },
          { value: "clicks", label: "Least clicked" },
          { value: "-unitsSold", label: "Most sold (qty)" },
          { value: "unitsSold", label: "Least sold (qty)" },
        ]}
      />
    </div>
  );
}

export default ProductOperations;
