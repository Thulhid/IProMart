"use client";

import DropdownFilter from "@/app/_components/DropdownFilter";

const STATUS_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Accepted", value: "ACCEPTED" },
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "On hold", value: "ON_HOLD" },
  { label: "Ready for pickup", value: "READY_FOR_PICKUP" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const PAYMENT_STATUS_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Paid", value: "PAID" },
  { label: "Field", value: "FIELD" }, // adjust if your backend uses a different word (e.g. PENDING)
  { label: "Canceled", value: "CANCELED" },
];

function AdminRepairJobFilters() {
  return (
    <div className="mb-4 flex w-full items-center justify-end gap-3">
      <DropdownFilter
        label="Payment"
        filterField="paymentStatus"
        options={PAYMENT_STATUS_OPTIONS}
        searchParamsToReset={[{ name: "page", value: "1" }]}
      />
      <DropdownFilter
        label="Status"
        filterField="status"
        options={STATUS_OPTIONS}
        searchParamsToReset={[{ name: "page", value: "1" }]}
        className="mr-4"
      />
    </div>
  );
}

export default AdminRepairJobFilters;
