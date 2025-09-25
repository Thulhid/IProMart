"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { forgotPasswordSchema } from "@/app/_utils/validationSchema";
import { GiBrokenShield, GiCardPick } from "react-icons/gi";
import { HiCog6Tooth } from "react-icons/hi2";

import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import AnimateTitle from "@/app/_components/AnimateTitle";
import { forgotPassword } from "@/app/_lib/auth-service";
import { formatTime } from "@/app/_utils/helper";
import MiniSpinner from "@/app/_components/MiniSpinner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(0); // seconds countdown

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  // Countdown effect
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const onSubmit = async ({ email }) => {
    setIsLoading(true);
    const toastId = toast.loading("Sending reset link...");

    try {
      const res = await forgotPassword(email);
      toast.success(res.message, { id: toastId });

      // Start 5-minute timer
      setTimer(300);
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContainerBox>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-xl rounded-2xl border border-zinc-600 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40"
      >
        <AnimateTitle>
          <GiCardPick />
          Forgot Password
        </AnimateTitle>

        <div className="mt-6">
          <label className="mb-1 block text-zinc-400">Email</label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email"
            className="input w-full"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="mt-6">
          <Button
            variant="primary"
            disabled={isLoading || timer > 0}
            configStyles="ml-auto"
          >
            {!isLoading ? (
              timer > 0 ? (
                `Resend in ${formatTime(timer)}`
              ) : (
                "Send Reset Link"
              )
            ) : (
              <MiniSpinner size={25} configStyles="text-zinc-300" />
            )}
          </Button>
        </div>
      </form>
    </ContainerBox>
  );
}
