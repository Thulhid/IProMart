"use client";

import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import Spinner from "@/app/_components/Spinner";
import { getShippingAddresses } from "@/app/_lib/customer-service";
import {
  createRepairJob,
  getRepairRequestById,
} from "@/app/_lib/repairing-service";
import { getSetting } from "@/app/_lib/setting-service";
import { formatCurrency } from "@/app/_utils/helper";
import { createRepairJobSchema } from "@/app/_utils/validationSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { HiOutlineChevronLeft } from "react-icons/hi2";

function FormRepairJobPage() {
  const [shippingFee, setShippingFee] = useState(0);

  const searchParams = useSearchParams();
  const router = useRouter();
  const request = searchParams.get("req") ?? "";
  const customer = searchParams.get("customer") ?? "";
  const [requestSummary, setRequestSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(createRepairJobSchema),
    defaultValues: {
      request: "",
      customer: "",
      amount: undefined,
      note: "",
      shippingIncluded: false,
    },
  });

  // put query params into the actual submitted fields
  useEffect(() => {
    setValue("request", request);
    setValue("customer", customer);
  }, [request, customer, setValue]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const res = await getRepairRequestById(request);
        setRequestSummary(res.data.data);
      } catch (err) {
        toast.error(err.message || "fetch request data failed!");
      } finally {
        setIsLoading(false);
      }
    })();
  }, [request]);

  useEffect(() => {
    (async () => {
      try {
        const res = await getSetting(process.env.NEXT_PUBLIC_SETTING_ID);
        setShippingFee(res.data.data.shippingFee);
      } catch (err) {
        toast.error(err.message || "Failed to load shipping fee");
      }
    })();
  }, []);

  const [shippingAddress] =
    requestSummary?.customer?.shippingAddresses?.filter(
      (address) => address.isDefault === true,
    ) || [];

  const isShippingFee = watch("shippingIncluded");
  const onSubmit = async (data) => {
    const toastId = toast.loading("Saving...");

    const dataObj = {
      ...data,
      shippingAddress,
      amount: data.amount ? data.amount : 0,
      shippingFee: isShippingFee ? shippingFee : 0,
    };

    try {
      await createRepairJob(dataObj);
      toast.success("Job created successfully!", { id: toastId });
      reset();
      router.push("/admin/repair-jobs");
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  if (isLoading) return <Spinner />;
  return (
    <>
      <div className="flex items-start gap-3">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>

        <div>
          <h1 className="text-3xl font-semibold text-zinc-300">
            Repair Job Submission
          </h1>
        </div>
      </div>
      <div className="mx-auto max-w-6xl p-4">
        {/* ---- Request Summary (simple & short) ---- */}
        <section className="my-10 flex w-fit flex-col rounded-xl bg-zinc-900 p-4 shadow-md">
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            {/* Main info */}
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <p className="text-zinc-400">Device:</p>
                <p className="font-medium text-zinc-500">
                  {requestSummary?.device}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <p className="text-zinc-400">Brand:</p>
                <p className="font-medium text-zinc-500">
                  {requestSummary?.brand}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <p className="text-zinc-400">Model:</p>
                <p className="font-medium text-zinc-500">
                  {requestSummary?.model}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <p className="text-zinc-400">Serial No:</p>
                <p className="font-medium text-zinc-500">
                  {requestSummary?.serialNumber || "-"}
                </p>
              </div>
            </div>
          </div>
          <Button
            link={`/admin/repair-requests/${request}`}
            configStyles="text-blue-400 text-sm hover:underline cursor-pointer ml-auto mt-4"
          >
            View Details
          </Button>
        </section>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* hidden values that actually submit */}
          <input type="hidden" {...register("request")} />
          <input type="hidden" {...register("customer")} />

          {/* Row 1: Request & Customer (read-only mirrors) */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 text-sm text-zinc-400">Request ID</label>
              <input
                type="text"
                value={request}
                readOnly
                className="input text-zinc-500"
                aria-invalid={errors.request ? true : undefined}
              />
              {errors.request && (
                <p className="mt-1 text-xs text-red-500">
                  {String(errors.request.message)}
                </p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm text-zinc-400">Customer ID</label>
              <input
                type="text"
                value={customer}
                readOnly
                className="input text-zinc-500"
                aria-invalid={errors.customer ? true : undefined}
              />
              {errors.customer && (
                <p className="mt-1 text-xs text-red-500">
                  {String(errors.customer.message)}
                </p>
              )}
            </div>
          </section>

          {/* Row 2: Amount & Note (two per row on md+, single column on mobile) */}
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="flex flex-col">
              <label className="mb-1 text-sm text-zinc-400">
                Job Amount (Rs.)
              </label>
              <input
                type="number"
                className="input"
                aria-invalid={errors.amount ? true : undefined}
                {...register("amount")}
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-red-500">
                  {String(errors.amount.message)}
                </p>
              )}
            </div>
            {/* Shipping fee toggle */}
            <div className="mt-2">
              <label className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-blue-400"
                  {...register("shippingIncluded")}
                />
                <span>
                  Include shipping fee{" "}
                  {typeof shippingFee === "number"
                    ? `(${formatCurrency(shippingFee)})`
                    : ""}
                </span>
              </label>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 text-sm text-zinc-400">
                Note (optional)
              </label>
              <textarea
                rows={4}
                className="input"
                aria-invalid={errors.note ? true : undefined}
                {...register("note")}
              />
              {errors.note && (
                <p className="mt-1 text-xs text-red-500">
                  {String(errors.note.message)}
                </p>
              )}
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end">
            <Button variant="primary" configStyles="px-6" type="submit">
              {isSubmitting ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default FormRepairJobPage;
