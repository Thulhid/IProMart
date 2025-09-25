"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/app/_components/Button";

const ALL_METHODS = ["PAYHERE", "CASH", "BANK_TRANSFER"];
const STATUSES = ["PENDING", "PAID", "FAILED"];

function UpdateRepairJobPayment({
  id,
  currentMethod = "CASH",
  currentStatus = "PENDING",
  allowPayHere = false, // toggle PAYHERE visibility per customer
  onUpdateRepairJob, // (id, { paymentMethod, paymentStatus })
  onCloseModal,
  total,
}) {
  // Build method options based on allowPayHere
  const methodOptions = useMemo(
    () =>
      allowPayHere ? ALL_METHODS : ALL_METHODS.filter((m) => m !== "PAYHERE"),
    [allowPayHere],
  );

  const [paymentMethod, setPaymentMethod] = useState(
    methodOptions.includes(currentMethod) ? currentMethod : methodOptions[0],
  );
  const [paymentStatus, setPaymentStatus] = useState(currentStatus);

  // If PAYHERE gets filtered out after mount (e.g., customer changes), keep selection valid
  useEffect(() => {
    if (!methodOptions.includes(paymentMethod)) {
      setPaymentMethod(methodOptions[0]);
    }
  }, [methodOptions, paymentMethod]);

  return (
    <div className="p-3">
      <h3 className="text-sm font-semibold text-zinc-200">Update Payment</h3>

      {/* Payment Method */}
      <label className="mt-2 block text-xs text-zinc-400">Payment Method</label>
      <select
        className="mt-1 w-full cursor-pointer rounded border bg-zinc-700 px-2 py-1 text-sm text-zinc-300"
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        {methodOptions.map((m) => (
          <option key={m} value={m}>
            {m.replaceAll("_", " ")}
          </option>
        ))}
      </select>

      {/* Payment Status */}
      <label className="mt-4 block text-xs text-zinc-400">Payment Status</label>
      <select
        className="mt-1 w-full cursor-pointer rounded border bg-zinc-700 px-2 py-1 text-sm text-zinc-300"
        value={paymentStatus}
        onChange={(e) => setPaymentStatus(e.target.value)}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.replaceAll("_", " ")}
          </option>
        ))}
      </select>

      <Button
        variant={"primary"}
        onClick={async () => {
          await onUpdateRepairJob(id, {
            paymentMethod,
            paymentStatus,
            paidAmount: total,
          });
          onCloseModal?.();
        }}
        configStyles={"mt-5 ml-auto"}
      >
        Update
      </Button>
    </div>
  );
}

export default UpdateRepairJobPayment;
