"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import {
  getEmployeeById,
  updateEmployeeById,
} from "@/app/_lib/employee-service";
import { updateEmployeeSchema } from "@/app/_utils/validationSchema";
import Spinner from "@/app/_components/Spinner";

export default function UpdateEmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(updateEmployeeSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const res = await getEmployeeById(id);
        const employee = res.data.data;
        reset({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          mobileNumber: employee.mobileNumber,
          role: employee.role,
        });
      } catch (err) {
        toast.error("Failed to load employee");
        router.push("/admin/employees");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEmployee();
  }, [id, reset, router]);

  const onSubmit = async (data) => {
    try {
      await updateEmployeeById(id, data);
      toast.success("Employee updated successfully");
      router.push("/admin/employees");
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
          Update Employee
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

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Mobile Number</label>
              <input
                type="text"
                {...register("mobileNumber")}
                placeholder="07xxxxxxxx"
                className="input"
              />
              <p className="text-sm text-red-500">
                {errors.mobileNumber?.message}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Role</label>
              <select
                {...register("role")}
                className="rounded-md bg-zinc-800 px-4 py-2 text-zinc-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select a role</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
              <p className="text-sm text-red-500">{errors.role?.message}</p>
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
              configStyles="ml-auto"
            >
              {isSubmitting ? "Updating..." : "Update Employee"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
