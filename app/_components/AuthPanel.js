"use client";
import Button from "@/app/_components/Button";
import { getCustomer } from "@/app/_lib/customer-service";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getEmployee } from "@/app/_lib/employee-service";
import toast from "react-hot-toast";

function AuthPanel() {
  //const [user, setUser] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async function getUser() {
      const localUser = localStorage.getItem("role") || "gust";
      try {
        if (localUser === "customer") {
          const res = await getCustomer();
          setUser(res?.data.data);
        } else if (localUser === "employee") {
          const res = await getEmployee();
          setUser(res?.data.data);
        } else {
          setUser(null);
        }
      } catch (err) {
        toast.error(err.message);
      }
    })();
  }, [setUser]);
  return (
    <>
      {user ? (
        <div className="relative h-12 w-12 cursor-pointer overflow-hidden rounded-full border border-zinc-700">
          {user?.role ? (
            <Link href="/admin/me">
              <Image
                src={user?.photo}
                alt={user.firstName}
                fill
                className="object-cover"
                priority
              />
            </Link>
          ) : (
            <Link href="/me">
              <Image
                src={user.photo}
                alt={user.firstName}
                fill
                className="object-cover"
                priority
              />
            </Link>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <Button link="/auth/login" variant="primary">
            Login
          </Button>
          <Button link="/auth/signup" variant="primary">
            Sign up
          </Button>
        </div>
      )}
    </>
  );
}

export default AuthPanel;
