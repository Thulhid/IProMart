"use client";

import { useEffect, useState } from "react";
// import your JS Yup schema (with photos rules) from wherever you saved it
import Button from "@/app/_components/Button";
import { getRepairJobsByCustomerId } from "@/app/_lib/repairing-service";
import RepairJobBox from "@/app/_components/RepairJobBox";
import { getCustomer } from "@/app/_lib/customer-service";
import { useRouter } from "next/navigation";
import BackButton from "@/app/_components/BackButton";
import { HiOutlineChevronLeft } from "react-icons/hi2";

export default function RepairingPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState(null);
  useEffect(() => {
    (async () => {
      const res = await getRepairJobsByCustomerId();

      setJobs(res.data.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await getCustomer();
      if (!res) return router.push("/auth/login");
    })();
  }, [router]);

  return (
    <div className="m-auto max-w-[1440px]">
      <div className="mb-6 flex items-center gap-4">
        <BackButton>
          <HiOutlineChevronLeft
            className="text-zinc-50/50 group-hover:text-zinc-200 group-active:text-zinc-200"
            size={28}
            strokeWidth={3}
          />
        </BackButton>
        <h1 className="text-3xl font-semibold text-zinc-300">Repairs</h1>
      </div>
      <Button
        variant="primary"
        configStyles="w-fit ml-auto mr-5"
        link="/repairs/form-repair-request"
      >
        Create Repair request
      </Button>
      <RepairJobBox jobs={jobs} />
    </div>
  );
}
