"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HiLockClosed } from "react-icons/hi";
import { HiCog6Tooth } from "react-icons/hi2";

import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import AnimateTitle from "@/app/_components/AnimateTitle";
import { resetPassword } from "@/app/_lib/auth-service";
import { resetPasswordSchema } from "@/app/_utils/validationSchema";
import { GiKeyCard } from "react-icons/gi";
import MiniSpinner from "@/app/_components/MiniSpinner";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async ({ password, passwordConfirm }) => {
    setLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      // TODO: Make actual API call
      const res = await resetPassword(token, password, passwordConfirm);

      toast.success(res.message, { id: toastId });
      router.push("/auth/login");
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContainerBox>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl rounded-2xl border border-zinc-600 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40"
      >
        <AnimateTitle>
          <GiKeyCard />
          Reset Password
        </AnimateTitle>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-zinc-400">New Password</label>
            <input
              type="password"
              {...register("password")}
              className="input w-full"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-zinc-400">Confirm Password</label>
            <input
              type="password"
              {...register("passwordConfirm")}
              className="input w-full"
            />
            {errors.passwordConfirm && (
              <p className="mt-1 text-sm text-red-500">
                {errors.passwordConfirm.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button variant="signup" disabled={loading}>
            {!loading ? (
              "Reset Password"
            ) : (
              <MiniSpinner size={25} configStyles="text-zinc-300" />
            )}
          </Button>
        </div>
      </form>
    </ContainerBox>
  );
}
