"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
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
    <div className="mx-4 md:mx-10 my-6 2xl:max-w-5xl 2xl:mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-red-600 group-active:text-red-600"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl text-zinc-300 font-semibold">
          Create Employee
        </h1>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-zinc-900 shadow-lg shadow-red-600/40 p-8 rounded-lg border border-zinc-700 space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Full Name</label>
            <input
              type="text"
              {...register("fullName")}
              placeholder="John Doe"
              className="bg-zinc-800 px-4 py-2 rounded-md text-zinc-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <p className="text-red-500 text-sm">{errors.fullName?.message}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Email</label>
            <input
              type="email"
              {...register("email")}
              placeholder="example@domain.com"
              className="bg-zinc-800 px-4 py-2 rounded-md text-zinc-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Password</label>
            <input
              type="password"
              {...register("password")}
              className="bg-zinc-800 px-4 py-2 rounded-md text-zinc-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Mobile Number</label>
            <input
              type="text"
              {...register("mobileNumber")}
              placeholder="07xxxxxxxx"
              className="bg-zinc-800 px-4 py-2 rounded-md text-zinc-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            <p className="text-red-500 text-sm">
              {errors.mobileNumber?.message}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Role</label>
            <select
              {...register("role")}
              className="bg-zinc-800 px-4 py-2 rounded-md text-zinc-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="">Select a role</option>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
            <p className="text-red-500 text-sm">{errors.role?.message}</p>
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
