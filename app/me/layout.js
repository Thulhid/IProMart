// app/me/layout.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCustomer } from "@/app/_lib/customer-service";

export default function MeLayout({ children }) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(null); // null = loading

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await getCustomer();

        if (!res) router.replace("/auth/login");
        setIsAllowed(true);
      } catch (err) {
        router.replace("/auth/login");
      }
    }

    checkAccess();
  }, []);

  if (isAllowed === null)
    return (
      <div className="text-center mt-10 text-zinc-400">Checking access...</div>
    );

  return <>{children}</>;
}
