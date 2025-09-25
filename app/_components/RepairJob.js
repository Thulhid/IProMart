"use client";

import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { HiWrench } from "react-icons/hi2";
import { formatCurrency } from "@/app/_utils/helper";
import StatusTag from "@/app/_components/RepairJobStatusTag";

export default function RepairJob({ job }) {
  const router = useRouter();

  const created = job?.createdAt
    ? format(parseISO(job.createdAt), "dd MMM yyyy h.mmaaa")
    : "-";
  const id = job._id;
  return (
    <div
      onClick={() => router.push(`/repairs/${id}`)}
      className="cursor-pointer rounded-xl border-2 border-zinc-700 bg-zinc-800 p-4 transition-colors hover:border-blue-600 md:p-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-zinc-200">
          <HiWrench size={20} className="text-zinc-400" />
          <span className="text-sm">
            <span className="font-medium">Job ID:</span> {job._id}
          </span>
        </div>
        <span className="text-sm text-zinc-400">{created}</span>
      </div>

      {/* Middle row */}
      <div className="my-8 flex w-fit flex-col items-center justify-start gap-3 text-sm text-zinc-300 xl:flex-row xl:space-x-8">
        <div className="inline-flex gap-2">
          <span className="text-zinc-400">Brand:</span>
          <span>{job.request.brand}</span>
        </div>
        <div className="inline-flex gap-2">
          <span className="text-zinc-400">Model:</span>
          <span>{job.request.model}</span>
        </div>
        <div className="inline-flex gap-2">
          <span className="text-zinc-400">Device:</span>
          <span>{job.request.device}</span>
        </div>

        {/* <span className="w-28 text-zinc-400">Request</span>
          <span className="truncate">{job.request}</span> */}
      </div>

      <div className="flex items-center gap-3 text-zinc-300">
        <span className="w-28 text-zinc-400">Amount</span>
        <span className="font-semibold text-zinc-100">
          {formatCurrency(job.amount)}
        </span>
      </div>
      <div className="flex items-center gap-3 text-zinc-300">
        <span className="text-zinc-400">Payment Status</span>
        <span className={`${job.paymentStatus === "PAID" && "text-green-600"}`}>
          {job.paymentStatus === "PENDING" ? "Not paid yet" : job.paymentStatus}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-700 pt-4 text-sm text-zinc-300">
        <div className="flex items-center gap-3">
          <StatusTag status={job.status} />
        </div>
      </div>
    </div>
  );
}
