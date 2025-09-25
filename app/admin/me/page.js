"use client";

import Image from "next/image";
import { MdEmail, MdPhone } from "react-icons/md";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";

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
  }, []);

  async function handleLogout() {
    const toastId = toast.loading("Wait a sec...");
    try {
      const res = await employeeLogout();
      toast.success("Logged Out", { id: toastId });
      router.push("/products");
    } catch (err) {
      toast.success(err.message, { id: toastId });
    }
  }

  if (!employee && isLoading) return <Spinner />;
  if (!employee)
    return (
      <p className="text-zinc-400 font-mono">No employee could be found.</p>
    );

  return (
    <ContainerBox>
      <div className="relative w-full max-w-4xl bg-zinc-900 shadow-lg shadow-red-600/40 p-8 rounded-2xl border border-zinc-700">
        <Button
          configStyles="text-zinc-300 text-sm absolute right-5 top-5 flex items-center cursor-pointer gap-1 hover:text-red-600 group"
          onClick={handleLogout}
        >
          <GiBrokenBone
            size={25}
            className="text-zinc-300 group-hover:text-red-600"
          />
          Logout
        </Button>
        <AnimateTitle>Account Overview</AnimateTitle>

        <div className="flex flex-col lg:flex-row items-center gap-10 mt-8 px-2">
          {/* Profile Image */}
          <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-zinc-700">
            <Image
              src={employee.photo}
              alt={employee.fullName}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div className="flex-1 w-full text-zinc-300 space-y-4">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-100">
                {employee.fullName}
              </h2>
              <p className="text-sm text-zinc-400 capitalize">
                {employee.role}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <MdEmail className="text-red-500" size={22} />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MdPhone className="text-red-500" size={22} />
                <span>{employee.mobileNumber}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-4">
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
  );
}
