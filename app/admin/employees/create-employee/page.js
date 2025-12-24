"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import { createEmployee } from "@/app/_lib/employee-service";
import { createEmployeeSchema } from "@/app/_utils/validationSchema";

export default function CreateEmployeePage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(createEmployeeSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    try {
      await createEmployee(data); // photo is excluded automatically
      toast.success("Employee created successfully");
      reset();
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
          Create Employee
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-lg border border-zinc-700 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">First Name</label>
            <input
              type="text"
              {...register("firstName")}
              placeholder="John"
              className="input"
            />
            <p className="text-sm text-red-500">{errors.firstName?.message}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Last Name</label>
            <input
              type="text"
              {...register("lastName")}
              placeholder="Doe"
              className="input"
            />
            <p className="text-sm text-red-500">{errors.lastName?.message}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="example@domain.com"
              className="input"
            />
            <p className="text-sm text-red-500">{errors.email?.message}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Password</label>
            <input
              type="password"
              {...register("password")}
              className="input"
            />
            <p className="text-sm text-red-500">{errors.password?.message}</p>
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
            configStyles="ml-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Employee"}
          </Button>
        </div>
      </form>
    </div>
  );
}
