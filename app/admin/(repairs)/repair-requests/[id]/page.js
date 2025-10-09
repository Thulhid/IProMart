"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";

import Slider from "@/app/_components/Slider";
import {
  getRepairJobs,
  getRepairRequestById,
} from "@/app/_lib/repairing-service";
import Button from "@/app/_components/Button";
import Spinner from "@/app/_components/Spinner";
import toast from "react-hot-toast";

function formatWhen(dateStr) {
  try {
    return new Date(dateStr).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "-";
  }
}

export default function Page() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobId, setJobId] = useState(null);
  const [jobRequestIds, setJobRequestIds] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getRepairRequestById(id);
        const reqData = res.data.data;
        const resJobs = await getRepairJobs();

        if (mounted) {
          setRequest(reqData);
          setJobRequestIds(
            resJobs.data.data.map((job) => {
              return { reqId: job.request._id, jobId: job._id };
            }),
          );
        }
      } catch (e) {
        if (mounted) toast.error(e?.message || "Failed to load request");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    (async () => {
      const [Ids] = jobRequestIds.filter((Ids) => Ids.reqId === request._id);
      setJobId(Ids?.jobId);
    })();
  }, [request?._id, jobRequestIds]);

  const {
    brand,
    model,
    device,
    serialNumber,
    problemDescription,
    photos = [],
    customer,
    updatedAt,
    _id,
  } = request || {};

  const defaultAddress =
    customer?.shippingAddresses?.find((a) => a.isDefault) ||
    customer?.shippingAddresses?.[0];

  if (loading) return <Spinner />;

  return (
    <div className="mx-4 my-2 grid grid-cols-1 content-center items-start gap-8 md:mx-10 xl:grid-cols-2 2xl:m-auto 2xl:max-w-6xl">
      {/* LEFT: header + media */}
      <section>
        {photos?.length ? (
          <Slider
            slides={photos}
            buttonColor={"!text-zinc-400 !group-hover:text-zinc-800"}
          />
        ) : (
          <div className="mt-4 grid h-56 w-full place-items-center rounded-lg bg-zinc-800 text-sm text-zinc-400">
            No photos
          </div>
        )}

        <div className="mt-6 flex flex-col items-center gap-2">
          <p className="text-sm text-zinc-400">
            Request ID: <span className="text-zinc-300">{_id}</span>
          </p>
          <p className="text-sm text-zinc-400">
            Updated:{" "}
            <span className="text-zinc-300">{formatWhen(updatedAt)}</span>
          </p>

          <p className="text-sm text-zinc-400">
            Photos: <span className="text-zinc-300">{photos.length}</span>
          </p>
        </div>
      </section>

      {/* RIGHT: details + actions */}
      <section className="ml-10 flex flex-col items-start gap-8">
        <div>
          <h2 className="mb-1 text-2xl font-bold tracking-wider text-zinc-300">
            Repair Request
          </h2>
          <div className="grid grid-cols-1 gap-2 text-sm text-zinc-300">
            <div className="flex gap-2">
              <span className="w-32 shrink-0 text-zinc-500">Device</span>
              <span>{device}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-32 shrink-0 text-zinc-500">Brand</span>
              <span>{brand}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-32 shrink-0 text-zinc-500">Model</span>
              <span>{model}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-32 shrink-0 text-zinc-500">Serial</span>
              <span>{serialNumber || "-"}</span>
            </div>
            <div className="mt-2 flex flex-col gap-2">
              <span className="flex-wrap text-base font-semibold text-zinc-400">
                Problem Description
              </span>
              <span className="text-base">{problemDescription}</span>
            </div>
          </div>
        </div>

        <div className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
          <h2 className="mb-2 text-xl font-semibold text-zinc-200">
            Customer Details
          </h2>
          <div className="grid grid-cols-1 gap-2 text-sm text-zinc-300">
            <div className="flex gap-2">
              <span className="w-40 shrink-0 text-zinc-500">Full Name</span>
              <span className="truncate">{`${customer?.firstName} ${customer?.lastName}`}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-40 shrink-0 text-zinc-500">Email</span>
              <span className="truncate">{customer?.email}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-40 shrink-0 text-zinc-500">Street</span>
              <span>{defaultAddress?.street}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-40 shrink-0 text-zinc-500">City</span>
              <span>{defaultAddress?.city}</span>
            </div>
            <div className="flex gap-2">
              <span className="w-40 shrink-0 text-zinc-500">Contact</span>
              <span>{defaultAddress?.mobileNumber}</span>
            </div>
          </div>
        </div>
        <div className="ml-auto w-fit">
          {!jobId ? (
            <Button
              variant="primary"
              link={`/admin/form-repair-job?req=${_id}&customer=${customer._id}`}
            >
              Create Job
            </Button>
          ) : (
            <Button variant={"primary"} link={`/admin/repair-jobs/${jobId}`}>
              View Job
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
