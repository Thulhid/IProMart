"use client";

import Image from "next/image";
import { MdEmail, MdPhone } from "react-icons/md";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineChevronLeft,
} from "react-icons/hi2";

import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import AnimateTitle from "@/app/_components/AnimateTitle";
import Spinner from "@/app/_components/Spinner";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getEmployee } from "@/app/_lib/employee-service";
import { employeeLogout } from "@/app/_lib/auth-service";
import toast from "react-hot-toast";
import { GiBrokenBone } from "react-icons/gi";
import BackButton from "@/app/_components/BackButton";

export default function Page() {
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchEmployee() {
      setIsLoading(true);
      try {
        const res = await getEmployee();
        if (!res) router.push("/auth/login");

        setEmployee(res.data.data); // ✅ Adjusted to match your Postman response
      } catch (err) {
        toast.error("Employee could not found");
      } finally {
        setIsLoading(false);
      }
    }
    fetchEmployee();
  }, [router]);

  async function handleLogout() {
    const toastId = toast.loading("Wait a sec...");
    try {
      const res = await employeeLogout();
      toast.success("Logged Out", { id: toastId });
      router.push("/");
    } catch (err) {
      toast.success(err.message, { id: toastId });
    }
  }

  if (!employee && isLoading) return <Spinner />;
  if (!employee)
    return (
      <p className="font-mono text-zinc-400">No employee could be found.</p>
    );

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-2xl font-semibold text-zinc-300 sm:text-3xl">
          Profile
        </h1>
      </div>
      <ContainerBox>
        <div className="relative w-full max-w-4xl rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40">
          <Button
            configStyles="text-zinc-300 text-sm absolute right-5 top-5 flex items-center cursor-pointer gap-1 hover:text-blue-700 group"
            onClick={handleLogout}
          >
            <GiBrokenBone
              size={25}
              className="text-zinc-300 group-hover:text-blue-700"
            />
            Logout
          </Button>
          <AnimateTitle>Account Overview</AnimateTitle>

          <div className="mt-8 flex flex-col items-center gap-10 px-2 lg:flex-row">
            {/* Profile Image */}
            <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-zinc-700">
              <Image
                src={employee.photo}
                alt={employee.firstName}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Info */}
            <div className="w-full flex-1 space-y-4 text-zinc-300">
              <div>
                <h2 className="text-2xl font-semibold text-zinc-100">
                  {`${employee.firstName} ${employee.lastName}`}
                </h2>
                <p className="text-sm text-zinc-400 capitalize">
                  {employee.role}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <MdEmail className="text-blue-700" size={22} />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MdPhone className="text-blue-700" size={22} />
                  <span>{employee.mobileNumber}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-wrap gap-3">
                <Button variant="primary" link="/admin/me/update-me">
                  Edit Profile
                </Button>
                <Button variant="secondary" link="/admin/me/update-my-password">
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ContainerBox>
    </>
  );
}
