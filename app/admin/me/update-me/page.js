"use client";

import { useForm } from "react-hook-form";
import { HiOutlineChevronLeft, HiCog6Tooth, HiPencil } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import Button from "@/app/_components/Button";
import BackButton from "@/app/_components/BackButton";
import { useEffect, useState } from "react";
import { updateCustomer } from "@/app/_lib/customer-service";
import toast from "react-hot-toast";
import Image from "next/image";
import ContainerBox from "@/app/_components/ContainerBox";
import { yupResolver } from "@hookform/resolvers/yup";
import { employeeUpdateSchema } from "@/app/_utils/validationSchema";
import Spinner from "@/app/_components/Spinner";
import MiniSpinner from "@/app/_components/MiniSpinner";
import { getEmployee, updateEmployee } from "@/app/_lib/employee-service";

export default function EditProfilePage() {
  const router = useRouter();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(employeeUpdateSchema) });

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      try {
        const res = await getEmployee();
        const employee = res.data.data;
        setEmployee(employee);
        reset({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
        });
        if (employee.photo?.startsWith("http")) {
          setPhoto(employee.photo);
        }
      } catch (err) {
        toast.error(err.message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [reset]);

  // useEffect(() => {
  //   if (customer) {

  //   }
  // }, [customer, reset]);

  const onSubmit = async (data) => {
    console.log("Submitted:", data);
    const toastId = toast.loading("Updating profile...");
    try {
      const { firstName, lastName } = data;
      const res = await updateEmployee(firstName, lastName, photoFile);
      toast.success(res.message, { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  return (
    <div className="mx-4 my-6 md:mx-10 2xl:mx-auto 2xl:max-w-[1440px]">
      {/* Back button and title */}
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">Edit Profile</h1>
      </div>

      {/* Form */}
      {isLoading || !employee ? (
        <Spinner />
      ) : (
        <ContainerBox>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-5xl rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40"
          >
            {/* Avatar */}
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
              <div className="flex flex-col items-center gap-4">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-zinc-700 sm:h-40 sm:w-40">
                  <Image
                    src={previewUrl || photo || "/default-user.png"}
                    alt={employee.firstName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <label className="cursor-pointer rounded-md bg-blue-600 px-3 py-1 text-xs text-red-50 transition-colors duration-300 disabled:cursor-not-allowed disabled:border-none">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setPhotoFile(file);
                        setPreviewUrl(URL.createObjectURL(file)); // preview before upload
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid w-full gap-6 sm:grid-cols-2">
                {/* First Name */}
                <div>
                  <label className="mb-1 block text-zinc-400">First Name</label>
                  <input
                    type="text"
                    {...register("firstName")}
                    className="input w-full"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="mb-1 block text-zinc-400">Last Name</label>
                  <input
                    type="text"
                    {...register("lastName")}
                    className="input w-full"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                {/* Email (readonly) */}
                <div>
                  <label className="mb-1 block text-zinc-400">Email</label>
                  <input
                    type="email"
                    disabled
                    {...register("email")}
                    className="w-full cursor-not-allowed rounded-md border border-zinc-700 bg-zinc-700 px-4 py-2 text-zinc-400"
                  />
                </div>

                {/* Mobile */}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex justify-end gap-4">
              <Button
                buttonType="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={isSubmitting}
                buttonType="submit"
              >
                {!isSubmitting ? (
                  "Save changes"
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
