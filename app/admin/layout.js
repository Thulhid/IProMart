// app/admin/layout.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEmployee } from "@/app/_lib/employee-service"; // Or getCustomer if needed

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(null); // null = loading

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await getEmployee();
        if (
          res?.data?.data?.role === "admin" ||
          res?.data?.data?.role === "employee"
        ) {
          setIsAllowed(true);
        } else {
          router.replace("/auth/login");
        }
      } catch (err) {
        router.replace("/auth/login");
      }
    }

    checkAccess();
  }, [router]);

  if (isAllowed === null)
    return (
      <div className="text-center mt-10 text-zinc-400">Checking access...</div>
    );

  return <>{children}</>;
}
