"use client";

import Image from "next/image";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

import Button from "@/app/_components/Button";
import ContainerBox from "@/app/_components/ContainerBox";
import AnimateTitle from "@/app/_components/AnimateTitle";
import { useEffect, useState } from "react";
import { customerLogout } from "@/app/_lib/auth-service";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import Spinner from "@/app/_components/Spinner";
import { getCustomer } from "@/app/_lib/customer-service";
import { GiBrokenBone } from "react-icons/gi";

export default function Page() {
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchCustomer() {
      setIsLoading(true);
      try {
        const resCustomer = await getCustomer();
        if (!resCustomer) router.push("/auth/login");
        setCustomer(resCustomer.data.data);
      } catch (err) {
        toast.error("Customer could not found");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomer();
  }, []);
  if (!customer && !isLoading)
    return (
      <p className="font-mono text-zinc-400">No customer could be found.</p>
    );
  if (!customer && isLoading) return <Spinner />;
  const defaultShippingAddress = customer.shippingAddresses?.find(
    (addr) => addr?.isDefault,
  );

  async function handleLogout() {
    const toastId = toast.loading("Wait a sec...");
    try {
      const res = await customerLogout();
      toast.success("Logged Out", { id: toastId });
      router.push("/products");
    } catch (err) {
      toast.success(err.message, { id: toastId });
    }
  }

  return (
    <ContainerBox>
      <div className="relative w-full max-w-4xl rounded-2xl border border-zinc-700 bg-zinc-900 p-8 shadow-lg shadow-blue-600/40">
        <Button
          configStyles="text-zinc-300 text-sm absolute right-5 top-5 flex items-center cursor-pointer gap-1 hover:text-blue-400 group"
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
              src={customer.photo}
              alt={customer.fullName}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Info */}
          <div className="w-full flex-1 space-y-4 text-zinc-300">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-100">
                {customer.fullName}
              </h2>
              <p className="text-sm text-zinc-400">Customer</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <MdEmail className="text-blue-700" size={22} />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <MdPhone className="text-blue-700" size={22} />
                <span>{defaultShippingAddress?.mobileNumber}</span>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <MdLocationOn className="text-blue-700" size={22} />
                <span>
                  {defaultShippingAddress?.street},{" "}
                  {defaultShippingAddress?.city}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="primary" link="/me/orders">
                My Orders
              </Button>
              <Button variant="secondary" link="/me/update-me">
                Edit Profile
              </Button>
              <Button link="/me/update-my-password" variant="secondary">
                Change Password
              </Button>
              <Button variant="secondary" link="/me/shipping-addresses">
                Change Address
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ContainerBox>
  );
}
