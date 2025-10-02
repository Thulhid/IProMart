"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { HiOutlineChevronLeft, HiWrench } from "react-icons/hi2";

import BackButton from "@/app/_components/BackButton";
import toast from "react-hot-toast";
import Spinner from "@/app/_components/Spinner";
import PayHereRepairButton from "@/app/_components/PayHereRepairButton";
import RepairJobDetails from "@/app/_components/RepairJobDetails";
import { getMyRepairJobById } from "@/app/_lib/repairing-service";
import { formatCurrency } from "@/app/_utils/helper";
import StatusTag from "@/app/_components/RepairJobStatusTag";

export default function Page() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  //
  const [includeShipping, setIncludeShipping] = useState(false);
  const base = Number(job?.amount || 0);
  const ship = Number(job?.shippingFee || 0);
  const total = includeShipping ? base + ship : base;
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMyRepairJobById(id);
        setJob(res.data.data);
      } catch (e) {
        toast.error(e.message || "Failed to fetch repair job details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-5xl">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">
          Repair Job Details
        </h1>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <RepairJobDetails job={job}>
          <div className="space-y-2">
            <div>
              <div className="text-base">
                <span className="text-zinc-400">Current Status: </span>
                <StatusTag status={job.status} />
              </div>
            </div>
            <div className="text-base">
              <span className="text-zinc-400">Customer Name: </span>
              <span>{job.customer.fullName}</span>
            </div>
            <div className="text-base">
              <span className="text-zinc-400">Email: </span>
              <span>{job.customer.email}</span>
            </div>
            <div className="text-base">
              <span className="text-zinc-400">Contact Number: </span>
              <span>{job.shippingAddress.mobileNumber}</span>
            </div>
            <div className="text-base">
              <span className="text-zinc-400">Shipping Address: </span>
              <span>{`${job.shippingAddress.street}, ${job.shippingAddress.city}`}</span>
            </div>

            <div className="text-base">
              <span className="text-zinc-400">Payment Status: </span>
              <span
                className={`text-sm ${job.paymentStatus === "PAID" && "text-green-600"}`}
              >
                {job.paymentStatus === "PENDING"
                  ? "Not paid yet."
                  : job.paymentStatus}
              </span>
            </div>
            {job.paidAmount > 0 && (
              <div className="text-base">
                <span className="text-zinc-400">Payment Method: </span>
                <span className="text-sm">
                  {job.paymentMethod.replace("_", " ")}
                </span>
              </div>
            )}
            {job.shippingFee > 0 && (
              <div>
                <span className="text-zinc-400">Shipping Fee: </span>
                <span>{formatCurrency(job.shippingFee)}</span>
              </div>
            )}
          </div>

          <div className="ml-auto flex w-fit flex-col items-end text-base font-semibold text-zinc-100">
            {job.amount ? (
              <>
                <div className="text-base">
                  <span className="text-zinc-400">Job Amount: </span>
                  <span>{formatCurrency(job.amount)}</span>
                </div>
                {ship > 0 && job.paidAmount === 0 && (
                  <label className="mt-3 inline-flex cursor-pointer items-center gap-2 font-medium select-none">
                    <span>Include shipping fee ({formatCurrency(ship)})</span>

                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-blue-500"
                      checked={includeShipping}
                      onChange={(e) => setIncludeShipping(e.target.checked)}
                    />
                  </label>
                )}

                <p className="mt-2 text-lg font-semibold text-zinc-100">
                  Total: {formatCurrency(total)}
                </p>
                {job.paidAmount === 0 && (
                  <PayHereRepairButton
                    totalAmount={total}
                    jobId={job._id}
                    configStyles="self-end mt-5"
                  />
                )}
                <div className="mt-10 flex flex-col items-end">
                  {job.paidAmount > 0 && <p>Paid amount: {job.paidAmount}</p>}
                  {job.paidAmount > job.amount && (
                    <p className="text-sm font-normal text-zinc-300">
                      Paid shipping fee ({job.shippingFee}){" "}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div>
                Job Amount: <span className="font-base">N/A</span>
              </div>
            )}
          </div>
        </RepairJobDetails>
      )}
    </div>
  );
}
