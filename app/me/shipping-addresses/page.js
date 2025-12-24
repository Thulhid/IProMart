"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  HiOutlineChevronLeft,
  HiPlus,
  HiMiniXMark,
  HiPencil,
  HiPencilSquare,
} from "react-icons/hi2";
import toast from "react-hot-toast";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import { GiSelect } from "react-icons/gi";
import { TbCurrentLocation } from "react-icons/tb";
import { addressSchema } from "@/app/_utils/validationSchema";
import SparkEffect from "@/app/_components/SparkEffect";
import {
  getShippingAddresses,
  createShippingAddresses,
  deleteShippingAddresses,
  updateShippingAddresses,
} from "@/app/_lib/customer-service";
import Spinner from "@/app/_components/Spinner";
import MiniSpinner from "@/app/_components/MiniSpinner";

export default function ShippingAddresses() {
  const [isLoading, setIsLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(addressSchema),
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchAddresses = async () => {
      try {
        const res = await getShippingAddresses();
        setAddresses(res.data.shippingAddresses);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleSetPrimary = async (id) => {
    const toastId = toast.loading("Wait a sec...");
    try {
      const target = addresses.find((a) => a._id === id);
      const resUpdate = await updateShippingAddresses(id, {
        ...target,
        isDefault: true,
      });
      const res = await getShippingAddresses();
      setAddresses(res.data.shippingAddresses);
      toast.success(resUpdate.message, { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading("Wait a sec...");
    try {
      await deleteShippingAddresses(id);
      const res = await getShippingAddresses();
      setAddresses(res.data.shippingAddresses);
      toast.success("Address deleted", { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  const onSubmit = async (data) => {
    const toastId = toast.loading("Wait a sec...");
    try {
      if (editingId) {
        const resUpdate = await updateShippingAddresses(editingId, data);
        toast.success(resUpdate.message, { id: toastId });
      } else {
        const resCreate = await createShippingAddresses(data);
        toast.success(resCreate.message, { id: toastId });
      }
      const res = await getShippingAddresses();
      setAddresses(res.data.shippingAddresses);
      reset();
      setEditingId(null);
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  const handleEdit = (address) => {
    setEditingId(address._id);
    setValue("street", address.street);
    setValue("city", address.city);
    setValue("mobileNumber", address.mobileNumber);
  };

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-[1440px]">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">
          Shipping Addresses
        </h1>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <ContainerBox>
          <div className="w-full max-w-3xl space-y-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40">
            {addresses.map((address) => (
              <div
                key={address._id}
                onClick={() => handleSetPrimary(address._id)}
                className={`relative flex cursor-pointer items-center justify-between gap-4 rounded-xl border-2 bg-zinc-800 p-4 transition-colors ${
                  address.isDefault
                    ? "border-blue-600"
                    : "border-zinc-700 hover:border-zinc-500"
                }`}
              >
                <div className="pointer-events-none flex items-center gap-4">
                  {address.isDefault ? (
                    <SparkEffect>
                      <TbCurrentLocation className="text-blue-400" size={24} />
                    </SparkEffect>
                  ) : (
                    <SparkEffect>
                      <GiSelect className="text-zinc-300" size={20} />
                    </SparkEffect>
                  )}
                  <div>
                    <p className="font-medium text-zinc-100">
                      {address.street}
                    </p>
                    <p className="text-zinc-200">{address.city}</p>
                    <p className="text-sm text-zinc-300">
                      {address.mobileNumber}
                    </p>
                  </div>
                </div>
                {address.isDefault && (
                  <span className="absolute -top-2 -left-2 rounded-full bg-blue-600 px-2 py-0.5 text-xs font-medium text-blue-50 shadow-md">
                    Primary
                  </span>
                )}
                <div
                  className="flex items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button onClick={() => handleEdit(address)} title="Edit">
                    <HiPencilSquare
                      className="cursor-pointer text-zinc-50/50 hover:text-red-600"
                      size={20}
                    />
                  </Button>
                  {!address.isDefault && (
                    <Button
                      variant="close"
                      onClick={() => handleDelete(address._id)}
                      title="Delete"
                    >
                      <HiMiniXMark size={20} strokeWidth={1} />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {addresses.length < 3 && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 rounded-xl border border-zinc-700 bg-zinc-800 p-4"
              >
                <h3 className="flex items-center gap-2 font-medium text-zinc-200">
                  <HiPlus
                    className="text-green-400"
                    strokeWidth={1}
                    size={20}
                  />{" "}
                  {editingId ? "Update Address" : "Add New Address"}
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    placeholder="Street"
                    {...register("street")}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    {...register("city")}
                    className="input"
                  />
                  <input
                    type="text"
                    placeholder="Mobile Number"
                    {...register("mobileNumber")}
                    className="input sm:col-span-2"
                  />
                </div>
                <div className="text-sm text-red-400">
                  {errors.street?.message ||
                    errors.city?.message ||
                    errors.mobileNumber?.message}
                </div>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting}
                  configStyles="ml-auto"
                >
                  {isSubmitting ? (
                    <MiniSpinner size={20} configStyles="text-zinc-300" />
                  ) : editingId ? (
                    "Update Address"
                  ) : (
                    "Add Address"
                  )}
                </Button>
              </form>
            )}
          </div>
        </ContainerBox>
      )}
    </div>
  );
}
