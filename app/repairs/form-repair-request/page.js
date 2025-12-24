"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// import your JS Yup schema (with photos rules) from wherever you saved it
import { CustomerRepairingSchema } from "@/app/_utils/validationSchema";
import Button from "@/app/_components/Button";
import { getCustomer } from "@/app/_lib/customer-service";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  createRepairing,
  createRepairRequests,
} from "@/app/_lib/repairing-service";
import BackButton from "@/app/_components/BackButton";
import { HiOutlineChevronLeft } from "react-icons/hi2";

const MAX_FILES = 5;
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export default function FormRepairRequestPage() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(CustomerRepairingSchema),
    defaultValues: {
      brand: "",
      model: "",
      device: "",
      serialNumber: "",
      problemDescription: "",
      photos: undefined,
    },
  });

  const router = useRouter();
  const files = watch("photos");
  const fileArray = useMemo(() => {
    if (!files) return [];
    if (typeof FileList !== "undefined" && files instanceof FileList) {
      return Array.from(files);
    }
    return Array.isArray(files) ? files : [];
  }, [files]);

  // revoke object URLs on unmount (avoid memory leaks)
  useEffect(() => {
    return () => {
      fileArray.forEach((f) => URL.revokeObjectURL?.(f.preview));
    };
  }, [fileArray]);

  useEffect(() => {
    (async () => {
      const currentCustomer = await getCustomer();
      if (!currentCustomer) return router.push("/auth/login");
    })();
  }, [router]);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //     } catch (err) {
  //       toast.error("Failed to load shipping fee");
  //     }
  //   })();
  // }, []);
  const onFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    let next = selected;

    // merge with existing (optional). comment this out if you want "replace" behavior
    if (fileArray.length) next = [...fileArray, ...selected];

    // validations (client-side guard; Yup also validates)
    if (next.length > MAX_FILES) {
      setError("photos", {
        message: `You can upload up to ${MAX_FILES} photos`,
      });
      next = next.slice(0, MAX_FILES);
    }

    const invalidType = next.find((f) => !ALLOWED.includes(f.type));
    if (invalidType) {
      setError("photos", {
        message: "Only JPG, JPEG, PNG, or WEBP images are allowed",
      });
      return;
    }

    const tooBig = next.find((f) => f.size > MAX_SIZE);
    if (tooBig) {
      setError("photos", { message: "Each photo must be smaller than 10 MB" });
      return;
    }

    clearErrors("photos");
    setValue("photos", next, { shouldValidate: true, shouldDirty: true });
  };

  const removeFile = (idx) => {
    const copy = [...fileArray];
    copy.splice(idx, 1);
    setValue("photos", copy, { shouldValidate: true, shouldDirty: true });
    if (!copy.length) clearErrors("photos");
  };

  const onSubmit = async (data) => {
    try {
      // Optional extra guard
      if (data.photos && data.photos.length > MAX_FILES) {
        setError("photos", {
          message: `You can upload up to ${MAX_FILES} photos`,
        });
        return;
      }
      const res = await createRepairRequests(data);
      // toast.success(res.message);
      router.replace("/repairs/form-repair-request/submitted");
    } catch (err) {
      toast.error(err.message);
      setError("root", { message: err.message });
    }
  };

  const desc = watch("problemDescription") || "";

  return (
    <div className="m-auto max-w-[1440px]">
      <div className="flex items-start">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <div className="mb-6 ml-3">
          <h1 className="text-2xl font-semibold text-zinc-200">Repair Form</h1>
          <p className="text-sm text-zinc-400">
            Tell us about the device and the issue.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* LEFT: main form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 md:col-span-2"
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm text-zinc-300">Brand</label>
                <input
                  {...register("brand")}
                  className="input w-full border p-2"
                />
                {errors.brand && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.brand.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-zinc-300">Model</label>
                <input
                  {...register("model")}
                  className="input w-full border p-2"
                />
                {errors.model && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.model.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-zinc-300">Device</label>
                <select
                  className="input w-full cursor-pointer border bg-zinc-700 text-zinc-300"
                  {...register("device")}
                >
                  <option value="">Select device</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Printer">Printer</option>
                  <option value="Scanner">Scanner</option>
                  <option value="Projector">Projector</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Mobile">Mobile Phone</option>
                  <option value="Router">Router</option>
                  <option value="Switch">Network Switch</option>
                  <option value="Server">Server</option>
                  <option value="ExternalHardDrive">External Hard Drive</option>
                  <option value="Keyboard">Keyboard</option>
                  <option value="Mouse">Mouse</option>
                  <option value="UPS">UPS (Power Backup)</option>
                  <option value="Other">Other</option>
                </select>
                {errors.device && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.device.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-zinc-300">
                  Serial Number (optional)
                </label>
                <input
                  className="input w-full border p-2"
                  {...register("serialNumber")}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-300">
                Issue Description
              </label>
              <textarea
                rows={4}
                {...register("problemDescription")}
                className="input w-full border p-2"
                maxLength={800}
              />
              <div className="mt-1 flex items-center justify-between">
                {errors.problemDescription ? (
                  <p className="text-sm text-red-600">
                    {errors.problemDescription.message}
                  </p>
                ) : (
                  <span className="text-xs text-zinc-400">
                    Describe symptoms, errors, noises, etc.
                  </span>
                )}
                <span className="text-xs text-zinc-500">{desc.length}/800</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-300">
                Photos (up to 5)
              </label>
              <input
                className="text-zinc-200 file:cursor-pointer file:rounded-md file:bg-blue-500 file:px-2"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={onFilesChange}
              />
              {errors.photos && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.photos.message}
                </p>
              )}

              {!!fileArray.length && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {fileArray.map((f, i) => (
                    <div
                      key={i}
                      className="overflow-hidden rounded border border-zinc-700"
                    >
                      <Image
                        src={URL.createObjectURL(f)}
                        alt={f.name}
                        className="h-28 w-full object-cover"
                        height={40}
                        width={50}
                      />
                      <div className="flex items-center justify-between p-2">
                        <p className="truncate text-xs text-zinc-300">
                          {f.name}
                        </p>
                        <button
                          type="button"
                          className="text-xs text-red-400 hover:text-red-300"
                          onClick={() => removeFile(i)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="mt-1 text-xs text-zinc-400">
                Max 5 photos, 10 MB each (JPG/PNG/WEBP).
              </p>
            </div>

            {errors.root && (
              <p className="text-sm text-red-600">{errors.root.message}</p>
            )}

            <div className="pt-2">
              <Button type="submit" disabled={isSubmitting} variant="primary">
                {isSubmitting ? "Submitting..." : "Submit Repair Request"}
              </Button>
            </div>
          </form>

          {/* RIGHT: sticky summary (like product detail sidebar) */}
          <aside className="md:col-span-1">
            <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
              <h2 className="text-lg font-semibold text-zinc-200">
                Submission Summary
              </h2>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li>
                  <span className="text-zinc-500">Brand:</span>{" "}
                  <strong>{watch("brand") || "-"}</strong>
                </li>
                <li>
                  <span className="text-zinc-500">Model:</span>{" "}
                  <strong>{watch("model") || "-"}</strong>
                </li>
                <li>
                  <span className="text-zinc-500">Device:</span>{" "}
                  <strong>{watch("device") || "-"}</strong>
                </li>
                <li>
                  <span className="text-zinc-500">Serial:</span>{" "}
                  <strong>{watch("serialNumber") || "-"}</strong>
                </li>
                <li>
                  <span className="text-zinc-500">Photos:</span>{" "}
                  <strong>
                    {fileArray.length}/{MAX_FILES}
                  </strong>
                </li>
              </ul>

              <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400">
                <p className="mb-1 font-medium text-zinc-300">
                  Tips for faster quotes
                </p>
                <ul className="list-disc pl-4">
                  <li>Include close-ups of damage/errors.</li>
                  <li>Add charger/accessories if relevant.</li>
                  <li>Describe when the issue started.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
