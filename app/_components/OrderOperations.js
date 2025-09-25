"use client";

import Filter from "@/app/_components/Filter";
import SortBy from "@/app/_components/SortBy";

function OrderOperations() {
  const searchParamsToReset = [{ name: "page", value: 1 }];
  return (
    <div className="mb-2 gap-1 sm:mb-3 sm:flex sm:gap-2 sm:justify-end">
      <Filter
        configStyles="!text-sm"
        filterField="orderStatus"
        options={[
          { value: "All", label: "All" },
          { value: "Pending", label: "Pending" },
          { value: "Processing", label: "Processing" },
          { value: "Shipped", label: "Shipped" },
          { value: "Delivered", label: "Delivered" },
          { value: "Cancelled", label: "Cancelled" },
        ]}
        searchParamsToReset={searchParamsToReset}
      />
      <SortBy
        options={[
          {
            value: "createdAt-desc",
            label: "Recent first",
          },
          {
            value: "createdAt-asc",
            label: "Earlier first",
          },
          { value: "totalAmount-asc", label: "Low  price first" },
          { value: "totalAmount-desc", label: "High price first" },
        ]}
      />
    </div>
  );
}

export default OrderOperations;
