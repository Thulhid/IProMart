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
          fullName: employee.fullName,
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
      const { fullName } = data;
      const res = await updateEmployee(fullName, photoFile);
      toast.success(res.message, { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  return (
    <div className="mx-4 md:mx-10 my-6 2xl:max-w-4xl 2xl:mx-auto">
      {/* Back button and title */}
      <div className="flex items-center gap-4 mb-6">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-red-600 group-active:text-red-600"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl text-zinc-300 font-semibold">Edit Profile</h1>
      </div>

      {/* Form */}
      {isLoading || !employee ? (
        <Spinner />
      ) : (
        <ContainerBox>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-5xl bg-zinc-900 shadow-lg shadow-red-600/40 p-8 rounded-2xl border border-zinc-700"
          >
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="flex flex-col gap-4 items-center">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-zinc-700 shrink-0">
                  <Image
                    src={previewUrl || photo || "/default-user.png"}
                    alt={employee.fullName}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <label className="cursor-pointer rounded-md text-xs transition-colors duration-300 disabled:cursor-not-allowed disabled:border-none bg-red-600 text-red-50 px-3 py-1">
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

              <div className="w-full grid sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="text-zinc-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    {...register("fullName")}
                    className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email (readonly) */}
                <div>
                  <label className="text-zinc-400 block mb-1">Email</label>
                  <input
                    type="email"
                    disabled
                    {...register("email")}
                    className="w-full px-4 py-2 bg-zinc-700 border border-zinc-700 text-zinc-400 rounded-md cursor-not-allowed"
                  />
                </div>

                {/* Mobile */}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-5">
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
