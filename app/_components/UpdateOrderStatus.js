"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Button from "./Button";
import { HiMiniChevronDown } from "react-icons/hi2";
import { getOrders, updateOrderStatus } from "@/app/_lib/order-service"; // ✅ import your function

const nextStatusMap = {
  Pending: ["Processing", "Cancelled"],
  Processing: ["Shipped", "Cancelled"],
  Shipped: ["Delivered"],
  Delivered: [],
  Cancelled: [],
};

function UpdateOrderStatus({ currentStatus, orderId, onCloseModal, onOrder }) {
  const [newStatus, setNewStatus] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const availableStatuses = nextStatusMap[currentStatus] || [];

  const handleUpdate = async () => {
    if (!newStatus) return;

    const toastId = toast.loading("Updating status...");
    try {
      await updateOrderStatus(orderId, newStatus);
      const res = await getOrders();
      onOrder(res.data.data);
      toast.success("Order status updated!", { id: toastId });
      // optionally: trigger refresh or close modal
    } catch (err) {
      toast.error("Failed to update order", { id: toastId });
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold text-zinc-200">
        Update Order Status
      </h2>

      <div className="relative">
        <button
          type="button"
          className="w-full bg-zinc-800 text-zinc-200 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-center cursor-pointer"
          onClick={() => setShowOptions((prev) => !prev)}
        >
          {newStatus ? (
            newStatus.charAt(0).toUpperCase() + newStatus.slice(1)
          ) : (
            <span>
              Select new status
              <HiMiniChevronDown className="inline-block ml-2" />
            </span>
          )}
        </button>

        {showOptions && (
          <ul className="absolute z-50 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded shadow cursor-pointer">
            {availableStatuses.map((status) => (
              <li
                key={status}
                onClick={() => {
                  setNewStatus(status);
                  setShowOptions(false);
                }}
                className="px-4 py-2 hover:bg-red-600 text-zinc-200 capitalize transition-colors duration-200 text-center"
              >
                {status}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={() => {
            handleUpdate();
            onCloseModal();
          }}
          disabled={!newStatus}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default UpdateOrderStatus;
