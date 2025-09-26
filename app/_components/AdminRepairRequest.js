import Button from "@/app/_components/Button";
import ConfirmDelete from "@/app/_components/ConfirmDelete";
import Modal from "@/app/_components/Modal";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

function AdminRepairRequest({ request, onDeleteRequestById }) {
  const {
    _id: id,
    brand,
    model,
    device,
    serialNumber,
    problemDescription,
    photos = [],
    updatedAt,
  } = request || {};

  const cover = photos?.[0] || null;

  return (
    <div className="flex flex-col gap-3 rounded-xl bg-zinc-900 p-4 shadow-md">
      {/* media */}
      {cover ? (
        <Image
          className="h-40 w-full rounded-lg object-cover sm:h-52 md:h-56"
          src={cover}
          alt={`${brand} ${model}`}
          width={600}
          height={400}
        />
      ) : (
        <div className="grid h-40 w-full place-items-center rounded-lg bg-zinc-800 text-sm text-zinc-400 sm:h-52 md:h-56">
          No photo
        </div>
      )}

      {/* main */}
      <div className="flex flex-col gap-1">
        <h2 className="truncate text-lg font-semibold text-zinc-200">
          {brand || "-"} {model ? `• ${model}` : ""}
        </h2>

        <p className="text-sm text-zinc-400">
          {device || "Device"}
          {serialNumber ? ` • SN: ${serialNumber}` : ""}
        </p>

        {problemDescription ? (
          <p className="line-clamp-3 text-sm text-zinc-300">
            {problemDescription}
          </p>
        ) : null}

        <p className="mt-1 text-xs text-zinc-400">
          Created: {format(new Date(updatedAt), "dd MMM yyyy h.mmaaa")}
        </p>
      </div>

      {/* actions (kept minimal, no extra props) */}
      <div className="mt-auto ml-auto flex w-fit justify-end gap-2">
        <Button
          link={`/admin/repair-requests/${id}`}
          variant="primary"
          configStyles=""
        >
          View request
        </Button>
        <Modal>
          <Modal.Open opens={"delete-request"}>
            <Button variant={"danger"}>Delete</Button>
          </Modal.Open>
          <Modal.Window name={"delete-request"}>
            <ConfirmDelete
              resource={"repair request"}
              onConfirm={() => onDeleteRequestById(id)}
            />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
}

export default AdminRepairRequest;
