"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "@/app/_utils/validationSchema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GiArmoredBoomerang } from "react-icons/gi";

import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import AnimateTitle from "@/app/_components/AnimateTitle";
import { customerLogin, employeeLogin } from "@/app/_lib/auth-service";
import MiniSpinner from "@/app/_components/MiniSpinner";

export default function Page() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const initialRole =
    typeof window !== "undefined" && localStorage.getItem("role")
      ? localStorage.getItem("role")
      : "customer";
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      role: initialRole,
    },
  });

  // On mount: get role from localStorage and set it
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    if (storedRole === "employee" || storedRole === "customer") {
      setValue("role", storedRole);
    } else {
      setValue("role", "customer");
    }
  }, [setValue]);

  // Watch role and update localStorage when changed
  const selectedRole = watch("role");
  useEffect(() => {
    if (selectedRole) localStorage.setItem("role", selectedRole);
  }, [selectedRole]);

  const onSubmit = async ({ email, password, role }) => {
    setIsLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const res =
        role === "employee"
          ? await employeeLogin(email, password)
          : await customerLogin(email, password);

      toast.success(res.message, { id: toastId });
      router.push("/products");
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ContainerBox>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-2xl rounded-2xl border border-zinc-600 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40"
      >
        <AnimateTitle>
          <GiArmoredBoomerang />
          Welcome Back
        </AnimateTitle>

        <div className="mt-6 grid grid-cols-1 gap-6 px-10 pb-5">
          {/* Email & password */}
          {[
            { name: "email", label: "Email", type: "email" },
            { name: "password", label: "Password", type: "password" },
          ].map(({ name, label, type }) => (
            <div key={name}>
              <label className="mb-1 block text-zinc-400">{label}</label>
              <input type={type} {...register(name)} className="input w-full" />
              {errors[name] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[name]?.message}
                </p>
              )}
              {name === "password" && (
                <div className="mt-2 text-right">
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-zinc-300 transition-colors hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>
          ))}

          {/* Role dropdown */}
          <div className="flex items-center gap-2">
            <label className="mb-1 block text-sm text-zinc-400">I am a</label>
            <select
              {...register("role")}
              className="cursor-pointer rounded-md border border-zinc-500 bg-zinc-800 text-sm text-zinc-400 transition focus:ring-2 focus:ring-zinc-500 focus:outline-none"
            >
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>

        <Button variant="signup" disabled={isLoading}>
          {!isLoading ? (
            "Login"
          ) : (
            <MiniSpinner size={25} configStyles="text-zinc-300" />
          )}
        </Button>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-zinc-200 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </ContainerBox>
  );
}
