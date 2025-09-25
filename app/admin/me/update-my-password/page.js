"use client";

import { useForm } from "react-hook-form";
import { HiOutlineChevronLeft, HiCog6Tooth } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Button from "@/app/_components/Button";
import BackButton from "@/app/_components/BackButton";
import toast from "react-hot-toast";
import ContainerBox from "@/app/_components/ContainerBox";
import { yupResolver } from "@hookform/resolvers/yup";
import { updatePasswordSchema } from "@/app/_utils/validationSchema";
import { updateEmployeePassword } from "@/app/_lib/auth-service";
import { useState } from "react";
import MiniSpinner from "@/app/_components/MiniSpinner";
import Spinner from "@/app/_components/Spinner";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: yupResolver(updatePasswordSchema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading("Updating password...");
    const { passwordCurrent, password, passwordConfirm } = data;
    try {
      // Replace with your actual API call
      const res = await updateEmployeePassword(
        passwordCurrent,
        password,
        passwordConfirm
      );
      toast.success(res.message, { id: toastId });
      reset();
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-4 md:mx-10 my-6 2xl:max-w-2xl 2xl:mx-auto">
      <div className="flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-red-600 group-active:text-red-600"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl text-zinc-300 font-semibold">
          Update Password
        </h1>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <ContainerBox>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-2xl bg-zinc-900 shadow-lg shadow-red-600/40 p-8 rounded-2xl border border-zinc-700 md:px-20"
          >
            <div className="grid gap-6">
              <div>
                <label className="text-zinc-400 block mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  {...register("passwordCurrent", {
                    required: "This field is required",
                  })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.passwordCurrent && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.passwordCurrent.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">New Password</label>
                <input
                  type="password"
                  {...register("password", {
                    required: "This field is required",
                  })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  {...register("passwordConfirm", {
                    required: "This field is required",
                    validate: (value, { newPassword }) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.passwordConfirm && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.passwordConfirm.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-5">
              <Button
                buttonType="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button variant="primary" disabled={isSubmitting}>
                {!isSubmitting ? (
                  "Save Password"
                ) : (
                  <MiniSpinner size={20} configStyles="text-zinc-300" />
                )}
              </Button>
            </div>
          </form>
        </ContainerBox>
      )}
    </div>
  );
}
