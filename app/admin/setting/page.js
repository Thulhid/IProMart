"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import ContainerBox from "@/app/_components/ContainerBox";
import BackButton from "@/app/_components/BackButton";
import Button from "@/app/_components/Button";
import MiniSpinner from "@/app/_components/MiniSpinner";
import Spinner from "@/app/_components/Spinner";
import { HiOutlineChevronLeft } from "react-icons/hi2";
import { updateSetting } from "@/app/_lib/setting-service";
import { getSetting } from "@/app/_lib/setting-service";
import { settingSchema } from "@/app/_utils/validationSchema";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(settingSchema),
  });

  useEffect(() => {
    setIsLoading(true);
    const fetchSetting = async () => {
      try {
        const res = await getSetting();
        setValue("shippingFee", res.data.data.shippingFee);
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSetting();
  }, [setValue]);

  const onSubmit = async (data) => {
    const toastId = toast.loading("Updating settings...");
    try {
      const res = await updateSetting(data);
      toast.success(res.message || "Settings updated!", { id: toastId });
    } catch (err) {
      toast.error(err.message || "Failed to update settings", { id: toastId });
    }
  };

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-4xl">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">App Settings</h1>
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <ContainerBox>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-xl space-y-6 rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40"
          >
            <div className="space-y-2">
              <label className="font-medium text-zinc-100">
                Shipping Fee (Rs.)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("shippingFee")}
                className="input"
              />
              <p className="text-sm text-red-400">
                {errors.shippingFee?.message}
              </p>
            </div>

            <Button
              variant="primary"
              buttonType="submit"
              disabled={isSubmitting}
              configStyles="ml-auto"
            >
              {isSubmitting ? (
                <MiniSpinner size={20} configStyles="text-zinc-300" />
              ) : (
                "Update Settings"
              )}
            </Button>
          </form>
        </ContainerBox>
      )}
    </div>
  );
}
