"use client";

import Button from "@/app/_components/Button";
import { useState } from "react";

const STATUSES = [
  "ACCEPTED",
  "IN_PROGRESS",
  "ON_HOLD",
  "READY_FOR_PICKUP",
  "COMPLETED",
  "CANCELLED",
];

function UpdateRepairJobStatus({
  currentStatus,
  id,
  onUpdateRepairJob,
  onCloseModal,
}) {
  const [status, setStatus] = useState(currentStatus);

  return (
    <div className="p-3">
      <h3 className="text-sm font-semibold text-zinc-200">Update Status</h3>

      <select
        className="mt-2 w-full cursor-pointer rounded border bg-zinc-700 px-2 py-1 text-sm text-zinc-300"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
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
          await onUpdateRepairJob(id, { status });
          onCloseModal?.();
        }}
        configStyles={"mt-5 ml-auto"}
      >
        Update
      </Button>
    </div>
  );
}

export default UpdateRepairJobStatus;
