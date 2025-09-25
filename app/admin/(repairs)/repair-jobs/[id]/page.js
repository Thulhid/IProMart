"use client";

import RepairJobDetails from "@/app/_components/RepairJobDetails";
import StatusTag from "@/app/_components/RepairJobStatusTag";
import Spinner from "@/app/_components/Spinner";
import { getRepairJobById } from "@/app/_lib/repairing-service";
import { formatCurrency } from "@/app/_utils/helper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function AdminRepairJobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getRepairJobById(id);
        setJob(res.data.data);
      } catch (e) {
        toast.error(e.message || "Failed to fetch repair job details");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);
  console.log(job);
  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-5xl">
      {loading || job === null ? (
        <Spinner />
      ) : (
        <RepairJobDetails job={job}>
          <div className="mr-auto flex flex-col justify-end space-y-2">
            <div className="text-base">
              <span className="text-zinc-400">Customer ID: </span>
              <span>{job.customer._id}</span>
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
              <span className="text-zinc-400">Current Status: </span>
              <StatusTag status={job.status} />
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
                  {job.paymentMethod.replaceAll("_", " ")}
                </span>
              </div>
            )}
            <div className="mt-5">
              <div className="text-base">
                <span className="text-zinc-400">Job Amount: </span>
                <span>{formatCurrency(job.amount)}</span>
              </div>
              {job.shippingFee > 0 && (
                <div>
                  <span className="text-zinc-400">Shipping Fee: </span>
                  <span>{formatCurrency(job.shippingFee)}</span>
                </div>
              )}
              <div className="text-xl font-semibold">
                <span>Total Amount: </span>
                <span>
                  {job.shippingFee > 0
                    ? formatCurrency(job.amount + job.shippingFee)
                    : job.amount}
                </span>
              </div>
            </div>
          </div>
        </RepairJobDetails>
      )}
    </div>
  );
}

export default AdminRepairJobDetailsPage;
