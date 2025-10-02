import Slider from "@/app/_components/Slider";
import { format, parseISO } from "date-fns";
import { HiWrench } from "react-icons/hi2";

function RepairJobDetails({ job, children }) {
  const createdAt = job?.createdAt
    ? format(parseISO(job.createdAt), "dd MMM yyyy h.mmaaa")
    : "-";
  const photos = job?.request?.photos || [];

  return (
    <div className="space-y-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-6 shadow-lg shadow-blue-600/30 sm:p-8">
      {/* top meta */}
      <div className="space-y-1 text-sm text-zinc-400">
        <p className="flex items-center gap-2">
          <HiWrench size={18} className="text-zinc-400" />
          <span>
            <span className="font-medium text-zinc-200">Job ID:</span> {job._id}
          </span>
        </p>
        <p>
          <span className="font-medium text-zinc-200">Created:</span>{" "}
          {createdAt}
        </p>
      </div>

      {/* request summary */}
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-zinc-700 bg-zinc-800 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="text-sm text-zinc-300">
          <span className="text-zinc-400">Brand:</span>{" "}
          {job.request?.brand || "-"}
        </div>
        <div className="text-sm text-zinc-300">
          <span className="text-zinc-400">Model:</span>{" "}
          {job.request?.model || "-"}
        </div>
        <div className="text-sm text-zinc-300">
          <span className="text-zinc-400">Device:</span>{" "}
          {job.request?.device || "-"}
        </div>
        <div className="text-sm text-zinc-300 sm:col-span-2 lg:col-span-3">
          <span className="text-zinc-400">Serial:</span>{" "}
          {job.request?.serialNumber || "-"}
        </div>
        <div className="text-sm text-zinc-300 sm:col-span-2 lg:col-span-3">
          <span className="text-zinc-400">Issue:</span>{" "}
          {job.request?.problemDescription || "—"}
        </div>
      </div>

      {/* media */}
      {photos.length ? (
        <Slider slides={photos} />
      ) : (
        <div className="grid h-44 w-full place-items-center rounded-lg bg-zinc-800 text-sm text-zinc-400">
          No photos
        </div>
      )}

      <div className="mt-5 flex flex-col gap-4 border-t border-zinc-700 pt-4 text-sm text-zinc-300 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-end gap-2">
          {/* If your button needs the amount instead, do: amount={total} */}
        </div>
        {children}
      </div>
    </div>
  );
}

export default RepairJobDetails;
