"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import {
  HiMiniXMark,
  HiOutlineChevronLeft,
  HiPencilSquare,
} from "react-icons/hi2";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import Spinner from "@/app/_components/Spinner";

import { useEffect, useState } from "react";
import { couponSchema } from "@/app/_utils/validationSchema";
import {
  createCoupon,
  deleteCoupon,
  getCoupons,
  updateCoupon,
} from "@/app/_lib/coupon-service";
import { formatCurrency } from "@/app/_utils/helper";

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(couponSchema),
    mode: "onTouched",
    context: { editingId },
    defaultValues: {
      code: "",
      minSubtotal: 0,
      discountAmount: 0,
      isActive: true,
    },
  });

  async function fetchCoupons() {
    setIsLoading(true);
    try {
      const res = await getCoupons();
      // adapt if your backend uses a different response shape
      setCoupons(res.data.data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCoupons();
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      code: String(data.code || "")
        .trim()
        .toUpperCase(),
      minSubtotal: Number(data.minSubtotal),
      discountAmount: Number(data.discountAmount),
      isActive: Boolean(data.isActive),
    };

    try {
      if (editingId) {
        await updateCoupon(editingId, payload);
        toast.success("Coupon updated");
      } else {
        await createCoupon(payload);
        toast.success("Coupon created");
      }

      await fetchCoupons();
      reset({ code: "", minSubtotal: 0, discountAmount: 0, isActive: true });
      setEditingId(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setValue("code", coupon.code || "");
    setValue("minSubtotal", coupon.minSubtotal ?? 0);
    setValue("discountAmount", coupon.discountAmount ?? 0);
    setValue("isActive", coupon.isActive ?? true);
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting...");
    try {
      await deleteCoupon(id);
      toast.success("Coupon deleted", { id: toastId });
      await fetchCoupons();
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

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
        <h1 className="text-3xl font-semibold text-zinc-300">Coupons</h1>
      </div>

      {editingId && (
        <Button
          onClick={() => {
            setEditingId(null);
            reset({
              code: "",
              minSubtotal: 0,
              discountAmount: 0,
              isActive: true,
            });
          }}
          variant="primary"
          configStyles="ml-auto "
        >
          + Add Coupon
        </Button>
      )}

      {isLoading ? (
        <Spinner />
      ) : (
        <ContainerBox>
          <div className="space-y-6">
            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 rounded-xl border border-zinc-700 bg-zinc-900 p-6"
            >
              <h2 className="text-lg font-medium text-zinc-200">
                {editingId ? "Update Coupon" : "Create New Coupon"}
              </h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {/* Code */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-400">Code</label>
                  <input
                    type="text"
                    {...register("code")}
                    placeholder="SAVE500"
                    className="input"
                  />
                  <p className="text-sm text-red-500">{errors.code?.message}</p>
                </div>

                {/* minSubtotal */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-400">Min Subtotal</label>
                  <input
                    type="number"
                    {...register("minSubtotal")}
                    placeholder="5000"
                    className="input"
                  />
                  <p className="text-sm text-red-500">
                    {errors.minSubtotal?.message}
                  </p>
                </div>

                {/* discountAmount */}
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-zinc-400">
                    Discount Amount
                  </label>
                  <input
                    type="number"
                    {...register("discountAmount")}
                    placeholder="500"
                    className="input"
                  />
                  <p className="text-sm text-red-500">
                    {errors.discountAmount?.message}
                  </p>
                </div>

                {/* isActive */}
                <div className="col-span-full flex items-center gap-3">
                  <input
                    type="checkbox"
                    {...register("isActive")}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <label className="text-sm text-zinc-300">Active</label>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  configStyles="ml-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? editingId
                      ? "Updating..."
                      : "Creating..."
                    : editingId
                      ? "Update Coupon"
                      : "Create Coupon"}
                </Button>
              </div>
            </form>

            {/* List */}
            {coupons.length !== 0 &&
              coupons.map((c) => (
                <div
                  key={c._id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-medium text-zinc-200">{c.code}</h3>
                    <p className="text-sm text-zinc-400">
                      Min subtotal: {formatCurrency(c.minSubtotal)}
                    </p>
                    <p className="text-sm text-zinc-400">
                      Discount: -{formatCurrency(c.discountAmount)}
                    </p>
                    <p className="text-sm text-zinc-500">
                      Status:{" "}
                      <span
                        className={
                          c.isActive ? "text-green-400" : "text-red-400"
                        }
                      >
                        {c.isActive ? "Active" : "Disabled"}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="edit" onClick={() => handleEdit(c)}>
                      <HiPencilSquare size={22} />
                    </Button>
                    <Button variant="close" onClick={() => handleDelete(c._id)}>
                      <HiMiniXMark size={20} strokeWidth={1} />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </ContainerBox>
      )}
    </div>
  );
}
