"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HiOutlineChevronLeft } from "react-icons/hi2";

import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import Spinner from "@/app/_components/Spinner";
import {
  getCustomerById,
  updateCustomerById,
  updateShippingAddresses,
  updateShippingAddressesByAdmin,
  updateShippingAddressesById,
} from "@/app/_lib/customer-service";
import { updateCustomerSchema } from "@/app/_utils/validationSchema";

export default function UpdateCustomerPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
    getValues,
    resetField,
  } = useForm({
    resolver: yupResolver(updateCustomerSchema),
    mode: "onTouched",
  });

  const { fields } = useFieldArray({
    control,
    name: "shippingAddresses",
  });

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await getCustomerById(id);
        const customer = res.data.data;

        reset({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          shippingAddresses: customer.shippingAddresses || [],
        });
      } catch (err) {
        toast.error("Failed to load customer");
        router.push("/admin/customers");
      } finally {
        setIsLoading(false);
      }
    }

    fetchCustomer();
  }, [id, reset, router]);
  const handleDefaultChange = (selectedIndex) => {
    const updatedAddresses = getValues("shippingAddresses").map((addr, i) => ({
      ...addr,
      isDefault: i === selectedIndex,
    }));
    resetField("shippingAddresses");
    reset({
      ...getValues(),
      shippingAddresses: updatedAddresses,
    });
  };

  const onSubmit = async (data) => {
    try {
      // Update basic fields
      await updateCustomerById(id, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });

      // Update each address
      await Promise.all(
        data.shippingAddresses.map((address) =>
          updateShippingAddressesById(id, address._id, {
            street: address.street,
            city: address.city,
            mobileNumber: address.mobileNumber,
            isDefault: address.isDefault,
          }),
        ),
      );

      toast.success("Customer updated successfully");
      router.push("/admin/customers");
    } catch (err) {
      toast.error(err.message);
    }
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
          Update Customer
        </h1>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 rounded-lg border border-zinc-700 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40"
        >
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">First Name</label>
              <input type="text" {...register("firstName")} className="input" />
              <p className="text-sm text-red-500">
                {errors.firstName?.message}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Last Name</label>
              <input type="text" {...register("lastName")} className="input" />
              <p className="text-sm text-red-500">{errors.lastName?.message}</p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Email</label>
              <input type="email" {...register("email")} className="input" />
              <p className="text-sm text-red-500">{errors.email?.message}</p>
            </div>
          </div>

          <h2 className="mt-6 text-lg font-semibold text-zinc-300">
            Shipping Addresses
          </h2>
          <div className="grid gap-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-lg border border-zinc-700 bg-zinc-800 p-4"
              >
                <input
                  type="hidden"
                  {...register(`shippingAddresses.${index}._id`)}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-zinc-400">Street</label>
                    <input
                      type="text"
                      {...register(`shippingAddresses.${index}.street`)}
                      className="input"
                    />
                    <p className="text-sm text-red-500">
                      {errors.shippingAddresses?.[index]?.street?.message}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-zinc-400">City</label>
                    <input
                      type="text"
                      {...register(`shippingAddresses.${index}.city`)}
                      className="input"
                    />
                    <p className="text-sm text-red-500">
                      {errors.shippingAddresses?.[index]?.city?.message}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-zinc-400">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      {...register(`shippingAddresses.${index}.mobileNumber`)}
                      placeholder="07xxxxxxxx"
                      className="input"
                    />
                    <p className="text-sm text-red-500">
                      {errors.shippingAddresses?.[index]?.mobileNumber?.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-4">
                    <input
                      type="checkbox"
                      checked={field.isDefault}
                      onChange={() => handleDefaultChange(index)}
                      className="scale-125 accent-blue-500"
                    />

                    <label className="text-sm text-zinc-400">
                      Default Address
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Customer"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
