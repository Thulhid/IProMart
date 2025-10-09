"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { customerDataSchema } from "@/app/_utils/validationSchema";
import Link from "next/link";
import { signupCustomer } from "@/app/_lib/auth-service";
import { useState } from "react";
import toast from "react-hot-toast";
import { SiKeycdn } from "react-icons/si";
import Button from "@/app/_components/Button";
import { useRouter } from "next/navigation";
import ContainerBox from "@/app/_components/ContainerBox";
import AnimateTitle from "@/app/_components/AnimateTitle";
import MiniSpinner from "@/app/_components/MiniSpinner";

export default function Page() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(customerDataSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const toastId = toast.loading("Hold on tight... preparing account");

    const payload = {
      ...data,
      shippingAddresses: [
        {
          street: data.street,
          city: data.city,
          mobileNumber: data.mobileNumber,
        },
      ],
    };
    delete payload.street;
    delete payload.city;
    delete payload.mobileNumber;
    try {
      const res = await signupCustomer(payload);

      reset();
      toast.success(res.message, { id: toastId });
      router.push(
        `/auth/email-verification?email=${encodeURIComponent(payload.email)}`,
      );
      // redirect or show toast here
    } catch (err) {
      // handle error UI
      // console.error(err);
      console.log(err);
      toast.error(err.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ContainerBox>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-4xl rounded-2xl border border-zinc-600 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40"
      >
        <AnimateTitle>
          <SiKeycdn />
          Create Account
        </AnimateTitle>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {[
            { name: "email", label: "Email", type: "email" },
            // { name: "fullName", label: "Full Name" },
            { name: "firstName", label: "First Name" },
            { name: "lastName", label: "Last Name" },

            {
              name: "mobileNumber",
              label: "Mobile (07x xxx xxxx)",
              type: "tel",
            },
            { name: "street", label: "Street" },
            { name: "city", label: "City" },
            { name: "password", label: "Password", type: "password" },
            {
              name: "passwordConfirm",
              label: "Confirm Password",
              type: "password",
            },
          ].map(({ name, label, type = "text" }) => (
            <div key={name}>
              <label className="mb-1 block text-zinc-400">{label}</label>
              <input type={type} {...register(name)} className="input w-full" />
              {errors[name] && (
                <p className="mt-1 text-sm text-red-500">
                  {errors[name]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <Button variant="signup" disabled={isLoading}>
          {!isLoading ? (
            "Sign Up"
          ) : (
            <MiniSpinner size={25} configStyles="text-zinc-300" />
          )}
        </Button>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-semibold text-zinc-200 hover:underline"
          >
            Login here
          </Link>
        </p>
      </form>
    </ContainerBox>
  );
}
